use el_proj ::{
    module::{parse::parse_module, Module},
    term::parse::parse_term,
};
use nom::combinator::all_consuming;
use nom::Parser;

use std::{
    env::{args, current_dir},
    path::Path,
};

use rustyline::{error::ReadlineError, DefaultEditor};

fn process(
    file: Option<&str>,
    line: &str,
    module: Module,
) -> Result<(), Box<dyn std::error::Error>> {
    let (_, body) = all_consuming(parse_term)
        .parse(line)
        .map_err(|e| e.to_string())?;
    let basepath = if let Some(p) = file {
        current_dir()?.join(Path::new(p).parent().expect("import to have a parent"))
    } else {
        current_dir()?
    };
    let t = module.to_term(basepath, body)?;
    println!("{1} :: {0}", t.type_check()?, t.multistep());
    Ok(())
}

fn prompt<T: AsRef<str>>(file: Option<T>) -> String {
    match file {
        None => "λ ".to_string(),
        Some(name) => format!("{} λ ", name.as_ref()),
    }
}

fn start_repl(file: Option<&str>, module: Module) -> Result<(), Box<dyn std::error::Error>> {
    let p = prompt(file);
    let mut rl = DefaultEditor::new()?;

    loop {
        let readline = rl.readline(&p);
        match readline {
            Ok(line) => {
                rl.add_history_entry(line.as_str())?;
                if line.trim() == ":q" {
                    break;
                }

                if let Err(e) = process(file, &line, module.clone()) {
                    eprintln!("{e}");
                }
            }
            Err(ReadlineError::Interrupted | ReadlineError::Eof) => {
                break;
            }
            Err(err) => {
                println!("Error: {:?}", err);
                break;
            }
        }
    }
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    match args().nth(1) {
        Some(name) => {
            let code = std::fs::read_to_string(&name).expect("failed to import file");
            let m = all_consuming(parse_module)
                .parse(&code)
                .expect("failed to parse code")
                .1;
            start_repl(Some(&name), m)?;
        }
        None => start_repl(None, Module::new())?,
    };
    Ok(())
}
