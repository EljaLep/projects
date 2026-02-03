use super::Term::{self, *};

fn step_op1(
    ctor: impl FnOnce(Box<Term>) -> Term,
    eval: impl FnOnce(Box<Term>) -> Term,
    t: Box<Term>,
) -> Term {
    if t.is_value() {
        eval(t)
    } else {
        ctor(Box::new(t.step()))
    }
}

fn step_op2(
    ctor: impl FnOnce(Box<Term>, Box<Term>) -> Term,
    eval: impl FnOnce(Box<Term>, Box<Term>) -> Term,
    t1: Box<Term>,
    t2: Box<Term>,
) -> Term {
    match (t1.is_value(), t2.is_value()) {
        (false, _) => ctor(Box::new(t1.step()), t2).into(),
        (true, false) => ctor(t1, Box::new(t2.step())).into(),
        (true, true) => eval(t1, t2),
    }
}

fn eval_app(t1: Box<Term>, t2: Box<Term>) -> Term {
    if let Abs { var, ty: _, body } = *t1 {
        body.subst(&var, *t2)
    } else {
        panic!("attempted to apply non abstraction to a value");
    }
}

fn eval_let(val_t: Box<Term>, var: impl AsRef<str>, body: Box<Term>) -> Term {
    body.subst(var.as_ref(), *val_t)
}

fn eval_ite(cond: Box<Term>, if_true: Box<Term>, if_false: Box<Term>) -> Term {
    match *cond {
        True => *if_true,
        False => *if_false,
        _ => panic!("attempted to if-then-else with non boolean condition"),
    }
}

impl Term {
    pub fn step(self) -> Self {
        match self {
            Var(y) => panic!("cannot evaluate a variable: {y}"),
            App(t1, t2) => step_op2(App, eval_app, t1, t2),

            Let { var, val_t, body } => step_op1(
                |val_t| Let {
                    var: var.clone(),
                    val_t,
                    body: body.clone(),
                },
                |val_t| eval_let(val_t, &var, body.clone()),
                val_t,
            ),

            Ite {
                cond,
                if_true,
                if_false,
            } => step_op1(
                |cond| Ite {
                    cond,
                    if_true: if_true.clone(),
                    if_false: if_false.clone(),
                },
                |cond| eval_ite(cond, if_true.clone(), if_false.clone()),
                cond,
            ),

            Add(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => Int( n+ m),
                    _ => Add(t1, Box::new(t2.step())),
                },
                _ => Add(Box::new(t1.step()), t2),
            },
            Sub(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => Int( n- m),
                    _ => Sub(t1, Box::new(t2.step())),
                },
                _ => Sub(Box::new(t1.step()), t2),
            },
            Mul(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => Int( n * m),
                    _ => Mul(t1, Box::new(t2.step())),
                },
                _ => Mul(Box::new(t1.step()), t2),
            },

            Eq(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => if n == m
                    {True} else {False},
                    _ => Eq(t1, Box::new(t2.step())),
                },
                _ => Eq(Box::new(t1.step()), t2),
            },
            Ne(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => if n != m
                    {True} else {False},
                    _ => Ne(t1, Box::new(t2.step())),
                },
                _ => Ne(Box::new(t1.step()), t2),
            },
            Lt(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => if n < m
                    {True} else {False},
                    _ => Lt(t1, Box::new(t2.step())),
                },
                _ => Lt(Box::new(t1.step()), t2),
            },
            Le(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => if n <= m
                    {True} else {False},
                    _ => Le(t1, Box::new(t2.step())),
                },
                _ => Le(Box::new(t1.step()), t2),
            },
            Gt(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => if n > m
                    {True} else {False},
                    _ => Gt(t1, Box::new(t2.step())),
                },
                _ => Gt(Box::new(t1.step()), t2),
            },
            Ge(t1, t2) => match *t1 {
                Int(n) => match *t2 {
                    Int(m) => if n >= m
                    {True} else {False},
                    _ => Ge(t1, Box::new(t2.step())),
                },
                _ => Ge(Box::new(t1.step()), t2),
            },
            Pair(t1, t2) => if t1.as_ref().is_value() {
                if t2.as_ref().is_value() {
                    panic!("attempted to step pair of values")
                } else {
                    Pair(t1, Box::new(t2.as_ref().clone().step()))
                }
            } else {
                if t2.is_value() {
                    Pair(Box::new(t1.as_ref().clone().step()), t2)
                } else {
                    Pair(Box::new(t1.as_ref().clone().step()), Box::new(t1.as_ref().clone().step()))
                }
            },
            Fst(v) => {
                match *v {
                    Pair(t, a) => if t.is_value() {
                        t.as_ref().clone()
                    } else {
                        Fst(Box::new(Pair(Box::new(t.as_ref().clone().step()), a)))
                    },
                    _ => panic!("fst of non-pair"),
                }
            },
            Snd(v) => {
                match *v {
                    Pair(a, t) => if t.is_value() {
                        t.as_ref().clone()
                    } else {
                        Snd(Box::new(Pair(a, Box::new(t.as_ref().clone().step()))))
                    },
                    _ => panic!("snd of non-pair"),
                }
            },
            
            Nil(_) => panic!("cannot step a value"),
            Cons(head, tail) => {
                if !head.is_value() {
                    Cons(Box::new(head.step()), tail)
                } else if !tail.is_value() {
                    Cons(head, Box::new(tail.step()))
                } else {
                    panic!("cannot step a value")
                }
            },
            LCase {
                t,
                nil_t,
                head_var,
                tail_var,
                cons_t,
            } => {
                if !t.is_value() {
                    LCase {
                        t: Box::new(t.step()),
                        nil_t,
                        head_var,
                        tail_var,
                        cons_t,
                    }
                } else {
                    match *t {
                        Nil(_) => *nil_t,
                        Cons(head, tail) => cons_t
                            .subst(&head_var, *head)
                            .subst(&tail_var, *tail),
                        _ => panic!("lcase on non-list"),
                    }
                }
            },
            Inl(ter, typ) => {
                if !ter.is_value() {
                    Inl(Box::new(ter.step()), typ)
                } else {
                    panic!("cannot step a value")
                }
            },
            Inl(ter, typ) => {
                if !ter.is_value() {
                    Inr(Box::new(ter.step()), typ)
                } else {
                    panic!("cannot step a value")
                }
            },
            Case {
                t,
                inl_var,
                inl_t,
                inr_var,
                inr_t,
            } => {
                if !t.is_value() {
                    Case {
                        t: Box::new(t.step()),
                        inl_var,
                        inl_t,
                        inr_var,
                        inr_t,
                    }
                } else {
                    match *t {
                        Inl(v, _) => inl_t.subst(&inl_var, *v),
                        Inr(v, _) => inr_t.subst(&inr_var, *v),
                        _ => panic!("case on non-sum"),
                    }
                }
            },
            Fix(t) => {
                if !t.is_value() {
                    Fix(Box::new(t.step()))
                } else if let Abs { var, ty: _, body } = t.clone().as_ref() {
                    body.clone().subst(&var, Fix(t))
                } else {
                    panic!("fix applied to non-abstraction")
                }
            },
            /*Print(t) => {
                if t.as_ref().is_value() {
                    match t {
                        True => {
                            println!("true");
                            self
                        },
                        False => {
                            println!("false");
                            self
                        },
                        Int(num) => {
                            println!("{num}");
                            self
                        },
                        Abs {var, val_t, body} => {
                            println!("Implicit function {var} of type {val_t}: ")
                        }
                    }
                }
            }*/
            _ => panic!("cannot step a value"),
        }
    }

    pub fn multistep(mut self) -> Self {
        while !self.is_value() {
            self = self.step()
        }
        self
    }
}