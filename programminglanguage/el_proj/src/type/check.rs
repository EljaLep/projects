use super::Type::{self, *};
use super::{
    Context,
    TypeError::{self, *},
};
use crate::term::Term::{self, *};

impl Term {
    /// Infers the type of the term `self`.
    ///
    /// # Errors
    ///
    /// - If the context doesn't contain the required variable, returns an [`UndefinedVariable`] error with the name of the variable inside.
    /// - If the left hand side of an application is not an arrow type, returns the [`WrongAppTypeLeft`] error with the actual type inside.
    /// - If the right hand side of an application is not of the expected type, returns the [`WrongAppTypeRight`] error with the actual type inside.
    /// - In other typing failures, the error [`Fail`] is returned.
    pub fn infer_type(&self, mut ctx: Context) -> Result<Type, TypeError> {
        match self {
            Var(x) => ctx.get(x).cloned().ok_or(UndefinedVariable(x.clone())),
            Abs { var, ty, body } => {
                ctx.insert(var.clone(), ty.clone());
                Ok(Arrow(
                    Box::new(ty.clone()),
                    Box::new(body.as_ref().infer_type(ctx)?),
                ))
            },
            App(term, term1) => {
                let ty1 = term.infer_type(ctx.clone())?;
                if let Arrow(dom, cod) = ty1 {
                    let ty2 = term1.infer_type(ctx)?;
                    if ty2 == *dom {
                        return Ok(*(cod));
                    } else {
                        return Err(WrongAppTypeRight(ty2));
                    }
                }
                Err(WrongAppTypeLeft(ty1))
            },

            Let { var, val_t, body } => {
                ctx.insert(var.clone(), val_t.infer_type(ctx.clone())?);
                body.infer_type(ctx)
            },

            True | False => Ok(Boolean),
            Ite {
                cond,
                if_true,
                if_false,
            } => {
                if let Boolean = cond.infer_type(ctx.clone())? {
                    let ty1 = if_true.infer_type(ctx.clone())?;
                    let ty2 = if_false.infer_type(ctx.clone())?;
                    if ty1 == ty2 {
                        return Ok(ty1);
                    }
                }
                Err(Fail)
            },

            Int(_) => Ok(Integer),
            Add(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Integer),
            Sub(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Integer),
            Mul(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Integer),
            Eq(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Boolean),
            Ne(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Boolean),
            Lt(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Boolean),
            Le(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Boolean),
            Gt(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Boolean),
            Ge(t1, t2) => op_check(t1.as_ref().clone(), t2.as_ref().clone(), ctx.clone(), Boolean),
            Pair(a, b) => match (a.as_ref().infer_type(ctx.clone()), b.as_ref().infer_type(ctx.clone())) {
                (Ok(a_t), Ok(b_t)) => Ok(Prod(Box::new(a_t), Box::new(b_t))),
                (_, _) => Err(Fail),
            },
            Fst(b) => if let Prod(ty1, _) = b.infer_type(ctx.clone())? {
                Ok(*ty1)
            }
            else {
                Err(Fail)
            },
             
            Snd(b) => {
                if let Prod(_, ty2) = b.infer_type(ctx.clone())? {
                    Ok(*ty2)
                } else {
                    Err(Fail)
                }
            },
            Nil(ty) => Ok(Type::List(Box::new(ty.clone()))),
            Cons(head, tail) => {
                let head_ty = head.infer_type(ctx.clone())?;
                let tail_ty = tail.infer_type(ctx)?;
                if let Type::List(tail_elem_ty) = tail_ty {
                    if head_ty == *tail_elem_ty {
                        Ok(Type::List(Box::new(head_ty)))
                    } else {
                        Err(TypeError::Fail)
                    }
                } else {
                    Err(TypeError::Fail)
                }
            },
            LCase {
                t,
                nil_t,
                head_var,
                tail_var,
                cons_t,
            } => {
                let list_ty = t.infer_type(ctx.clone())?;
                if let List(elem_ty) = list_ty {
                    let nil_ty = nil_t.infer_type(ctx.clone())?;
                    ctx.insert(head_var.clone(), *elem_ty.clone());
                    ctx.insert(tail_var.clone(), List(elem_ty));
                    let cons_ty = cons_t.infer_type(ctx)?;
                    if nil_ty == cons_ty
                     {
                        Ok(nil_ty)
                    } else {
                        Err(Fail)
                    }
                } else {
                    Err(Fail)
                }
            },
            Inl(ter, typ) => {
                let ty_a = ter.infer_type(ctx)?;
                Ok(Type::Sum(Box::new(ty_a), Box::new(typ.clone())))
            },
            Inr(ter, typ) => {
                let ty_b = ter.infer_type(ctx)?;
                Ok(Type::Sum(Box::new(typ.clone()), Box::new(ty_b.clone())))
            },
            Case {
                t,
                inl_var,
                inl_t,
                inr_var,  
                inr_t,
            } => {
                let sum_ty = t.infer_type(ctx.clone())?;
                if let Type::Sum(ty_a, ty_b) = sum_ty {
                    ctx.insert(inl_var.clone(), *ty_a);
                    let inl_ty = inl_t.infer_type(ctx.clone())?;
                    ctx.remove(inl_var);
                    ctx.insert(inr_var.clone(), *ty_b);
                    let inr_ty = inr_t.infer_type(ctx)?;
                    if inl_ty == inr_ty {
                        Ok(inl_ty)
                    } else {
                        Err(TypeError::Fail)
                    }
                } else {
                    Err(TypeError::Fail)
                }
            },
            Fix(t) => {
                let t_ty = t.infer_type(ctx)?;
                if let Type::Arrow(boxed_dom, boxed_cod) = t_ty {
                    //println!("layer 1");
                    if let Type::Arrow(dom_inner, cod_inner) = *boxed_dom {
                        //println!("layer 2");
                        if *boxed_cod == Type::Arrow(dom_inner.clone(), cod_inner.clone()) {
                            return Ok(*boxed_cod);
                        }
                    }
                }
                //println!("type error from fix check");
                Err(TypeError::Fail)
            },
        }
    }

    pub fn type_check(&self) -> Result<Type, TypeError> {
        self.infer_type(Context::new())
    }
}

fn op_check(t1: Term, t2: Term, ctx: Context, t: Type) -> Result<Type, TypeError> {
    let ty1 = t1.infer_type(ctx.clone());
    let ty2 = t2.infer_type(ctx);
    if ty1 == Ok(Integer) && ty2 == Ok(Integer) {
        Ok(t)
    } else {
        println!("error in opcheck");
        Err(Fail)
    }
} 
