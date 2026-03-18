Documentation for CS-C2170 project
Elja Leppänen

**TUTORIAL**

Install rustc and cargo from rustup.rs.

To start the language, do: cargo run main.stlc

2.1 Tour
3. Core language - code examples of language features


3.0 General
3.0.1 modules

	In the modules, only named variables and functions can be declared.

	Underscore is not supported. Use camelCase.
	
	Each statement must be spaced with one linebreak of buffer.
	
	To run a program written e.g. in file main.stlc, run main from the repl.
	
	e.g.
	
	main.stlc:
	
		factGen : Integer -> Integer
		factGen = fun n : Integer,
			if n <= 1 then 1 else n * factGen (n - 1)

		main : Integer 
		main = 
			let x = 5 in 
			let y = 1 in
			(factGen x) - (factGen y)
			
	then in REPL:
		
		input: main
		output: 119 :: ℤ


3.1 Variables

	Storing variables in modules is done with
	
		variable_name : (Type)
		variable_name = (value)
		
	In REPL or inside a statement in the modules it is done with:
	
		let variable_name = value in (following code)
		
	The variables are then defined in the following code. 
	
	e.g. 
	in REPL: 
	
		input: let x = 1 in x
		output: 1 :: ℤ
		
	For variables in module declarations, the type is redundant because of inferred
	type checking and, therefore, does not contribute to type checking.
	
	e.g.
	
	in main.stlc:
	
		main : Integer
		main = True
		
	then in REPL:
	
		input: main
		output: True :: 𝟚
		
	whereas for functions:
	
	in main.stlc
	
		func1 : Boolean -> Integer
		func1 = fun xs : Integer,
			xs
		
		main : Integer
		main = 0
	
	results in 
	
		input: main
		output: type error
	
3.2 Integers, booleans
3.2.1 Integers, Booleans can be assigned to variables and can be returned from functions. 
	
	e.g. assign True to variable x: 
	
		x : Boolean
		x = True
		
	in REPL:
	
		input: x
		output: True :: 𝟚
		
3.2.2 Conditional logic works with if (conditional) then (if_true) else (if_false)
	
	e.g.
		c : Integer
		c = if True then 1 else 0
		
	in REPL:
	
		input: c
		output: 1 :: ℤ
		
3.2.3 Additions, subtractions, and multiplications take Integers ret and return Integers
	
	e.g.
	in REPL:
	
		input: (1 + 3 * 4 – 2) / 5 
		output: 2 :: ℤ
	
	Negative numbers can be declared with (0-x).
	
	e.g.
	in REPL:
	
		input: 1 – 2
		output: -1 :: ℤ
		
		input: -1 * 2
		output: Parsing Error: Error { input: "-1 * 2", code: Tag }
		
		input: (0-2) * 4
		output: -8 :: ℤ
		
3.2.4 Basic comparison operators take Integers return Booleans
	
	e.g.
	in REPL:
	
		input: 1 <= 2
		output: True :: 𝟚
		
	available:
		==
		!=
		<
		<=
		>
		>=
	
	e.g. 
	in REPL:
	
		input: let x = 5 in if x < 10 then 0 else 10
		output: 0 :: ℤ
		
3.3 (Implicit) functions

	An implicit function is defined in the file or in REPL with

		fun (param) : (param_type), (body) 
		
		e.g.
		in REPL:
		
			input: fun x : Integer, x + 1
			output: 𝜆 x : ℤ. x + 1 :: ℤ → ℤ 
			
	and is applied to a term with
	
		(function) (term) 
		
		e.g.
		in REPL
		
			input: (fun x : Integer, x + 1) 2
			output: 3 :: ℤ
			
To have more than one parameter, use multiple implicit functions according to principles of functional programming. 

	e.g.
	in REPL:
	
		input: (fun x : Integer, fun y : Integer, x + y)
		output: 𝜆 x : ℤ. 𝜆 y : ℤ. x + y :: ℤ → ℤ → ℤ
		
Apply like this: (implicit_function) (param_1) (param_2)

3.4 Pairs

	Use (term1, term2) and fst (pair) and snd (pair).
	
	e.g.
	in REPL:
	
		input: (1, True)
		output: (1, True) :: ℤ × 𝟚

		input: fst (1, True)
		output: 1 :: ℤ
		
		
3.5 Lists
	Lists are constructed with 
	
		cons item_1 (cons item_2 (cons item_3 (nil List_Type)))
		
	e.g.
	in REPL:
	
		input: cons 1 ( nil Integer)
		output: [1] :: [ℤ]
		
	Also std-function range can be used when using Integers, which constructs a 
	list of integers from first parameter until (i.e. exclusively) the second parameter
	
	Import std in main.stlc:
	
	main.stlc:
	
		import std
	
	e.g.
	
	in REPL: 
	
		input range 1 10
		output: [1, 2, 3, 4, 5, 6, 7, 8, 9] :: [ℤ] 
		
	Lists can be combined with std-function append
	
	e.g.
	in REPL:
	
		input: append (range 1 5) (range 10 15)
		output: [1, 2, 3, 4, 10, 11, 12, 13, 14] :: [ℤ]
		
	Lists can be of type Integer or Boolean and can be deconstructed with std-functions ihead, 
	bhead, itail, btail to deconstruct lists (ihead for Integer bhead for Boolean etc.).
	
	e.g. 
	in REPL:
	
		input: let list = range 1 10 in ihead list
		output: 1 :: ℤ
		
		input: let list = range 1 10 in itail list
		output: [2, 3, 4, 5, 6, 7, 8, 9] :: [ℤ]
		
	For empty lists ihead and bhead return default values 0 and False, itail and btail return 
	empty lists [] :: [ℤ] and [] :: [𝟚]. 
	
	Lists can be pattern matched with lcase.
	
	e.g.
	in main.stlc:
	
		sum : [Integer] -> Integer
		sum = fun xs : [Integer],
			lcase xs of
			| nil => 0
   	  | cons x xs => x + sum xs
				
	in REPL:

		input: sum (range 1 10)
		output: 45 :: ℤ
	
	Get the n:th element safely with nth.
	
		import std
		
		nth (range 1 10) 4
		inl 5 :: ℤ + 𝟚
		
	Boolean lists are supported with bappend and bnth.
	
3.6 Sums

	Sums can be constructed with 
	
		inl (value) (Type)
		
	and 
	
		inr (value) (Type)
		
	e.g.
	in REPL:
	
		input: inl True Integer
		output: inl True :: 𝟚 + ℤ
		
	and they can be pattern matched with 
	
		case (injection) of 
		| inl a => (expression_of_a) 
		| inr a => (expression_of_a)
		
	e.g.
	in REPL: 
	
		input: case inl (2, 3) Integer of | inl x => fst x | inr y => y
		output: 2 :: ℤ
		
3.7 Recursion

	Recursive functions can be defined in REPL with the fix-operator
	
	e.g. recursive factorial function
	in REPL:
	
		input: let factGen = (fun fact : Integer -> Integer, fun n : Integer, if n <= 1 then 1 else n * fact (n - 1)) in (fix factGen) 10
		output: 3628800 :: ℤ
		
	In modules recursion works without the fix-operator
	
	e.g. recursive factorial function in main.stlc:
	
		factGen : Integer -> Integer
		factGen = fun n : Integer,
				if n <= 1 then 1 else n * factGen (n - 1)
				
	executing in REPL:
	
		input: factGen 5
		output: 120 :: ℤ
		
3.8 Declarations, modules, and imports
3.8.1 Declaring a named function

To declare a named function use

	in REPL:

		let (function_name) = (implicit_function)
	
	in modules:
	
		(function_name) : (function_type)
		(function_name) = (implicit function)
		
	e.g. 
	in main.stlc:
	
		addTwo : Integer -> Integer -> Integer
		addTwo = fun xs : Integer, fun ys : Integer, 
				xs + ys
				 
	executing in REPL:
	
		input: addTwo 1 3
		output: 4 :: ℤ
		
	Functions can be then called from other functions.
		
	e.g. logic gates
	in main.stlc:
	
		and : Boolean -> Boolean -> Boolean
		and = fun xs : Boolean, fun ys : Boolean, 
				if xs then ys else False

		or : Boolean -> Boolean -> Boolean
		or = fun xs : Boolean, fun ys : Boolean,
				if xs then True else ys

		not : Boolean -> Boolean 
		not = fun xs : Boolean, 
			if xs then False else True

		xor : Boolean -> Boolean -> Boolean
		xor = fun xs : Boolean, fun ys : Boolean,
				or (and (not xs) ys) (and (not ys) xs) 
				
	executing in REPL: 
	
		input: xor True True
		output: False :: 𝟚
		
	3.8.2 Import all the code from another file with
	
		import (relative_path)
		
	using . as the separator 
	
	e.g. to access functions in std, one would use
	
		import std
		
	where src contains main.stlc and std.stlc
		

3.12 **Bonus** Strings and characters

	Declare characters with 'a'.
	
	e.g.
	in REPL:
	
		input: let test = 'k' in test
		output: k :: c
	
	Strings are lists of characters.
	
	e.g.
	in REPL:
		
		input: let message = cons 'h' (cons 'e' ( cons 'l' ( cons 'l' ( cons 'o' (nil Character)))))
		output: "hello" :: [c]
		
	Combine strings with std-library strAppend and access n:th character safely with strNth
	
	e.g.
	in main.stlc
	
		import std
	
		exclamation : [Character]
		exclamation = cons 'h' (cons 'e' ( cons 'l' ( cons 'l' ( cons 'o' (nil Character)))))

		subject : [Character]
		subject = cons 'w' (cons 'o' ( cons 'r' ( cons 'l' ( cons 'd' (nil Character)))))

		main : [Character]
		main = strAppend exclamation (strAppend (cons ' ' (nil Character)) subject)
		
	in REPL:
	
		input: main
		output: "hello world" :: [c]
		
		input: strNth exclamation 4
		output: inl o :: c + 𝟚
		
		input: strNth exclamation 5
		inr False :: c + 𝟚
	
	

2.2 Programming exercises

2.2.1 Length of a list 

	ilen : [Integer] -> Integer
	ilen = fun list : [Integer], 
		lcase list of 
		| nil => 0
		| cons head tail => 1 + ilen tail
	
2.2.2 Modulo

	mod : Integer -> Integer -> Integer
	mod = fun xs : Integer, fun n : Integer,
		if xs < n then 
			xs 
		else if (xs - n) < n then 
			(xs - n) 
		else 
			mod (xs - n) n

2.2.3 Filter - test with isEven

	mod : Integer -> Integer -> Integer
	mod = fun xs : Integer, fun n : Integer,
		if xs < n then 
			xs 
		else if (xs - n) < n then 
			(xs - n) 
		else 
			mod (xs - n) n

	isEven : Integer -> Boolean
	isEven = fun xs : Integer, 
		if mod xs 2 == 0 then 
			True 
		else 
			False

	filter : [Integer] -> (Integer -> Boolean) -> [Integer]
	filter = fun list : [Integer], fun cond : Integer -> Boolean,
		lcase list of 
		| nil => nil Integer
		| cons head tail => if cond head then 
			cons head (filter tail cond) 
		else
			filter tail cond

2.2.4 Safe divide

	safeDiv : Integer -> Integer -> Integer + Boolean
	safeDiv = fun x : Integer, fun y : Integer, 
		if y == 0 then 
			inr False Integer
		else 
			let answer = x/y in
			inl answer Boolean
			
	main : Integer
	main = case (safeDiv 3 0) of
		| inl x => x
		| inr x => 999999
			
2.2.5  Twin primes

Files are divided into

------lists.stlc -------

	ilen : [Integer] -> Integer
	ilen = fun list : [Integer], 
		lcase list of 
		| nil => 0
		| cons head tail => 1 + ilen tail

	map : [Integer] -> (Integer -> Integer) -> [Integer]
	map = fun list : [Integer], fun operation : Integer -> Integer,
		lcase list of 
		| nil => nil Integer
		| cons head tail => cons (operation head) (map tail operation)

	zip : [Integer] -> [Integer] -> [(Integer, Integer)]
	zip = fun list1 : [Integer], fun list2 : [Integer],
		if ilen list1 == ilen list2 then
			lcase list1 of
			| nil => nil (Integer, Integer)
			| cons head1 tail1 => 
				lcase list2 of 
				| nil => nil (Integer, Integer)
				| cons head2 tail2 => cons (head1, head2) (zip tail1 tail2)
		else
			nil (Integer, Integer)

	filter : [Integer] -> (Integer -> Boolean) -> [Integer]
	filter = fun list : [Integer], fun cond : Integer -> Boolean,
		lcase list of 
		| nil => nil Integer
		| cons head tail => if cond head then 
			cons head (filter tail cond) 
		else
			filter tail cond
----------lists.stlc----------

----------math.stlc-------

	mod : Integer -> Integer -> Integer
	mod = fun xs : Integer, fun n : Integer,
		if xs < n then xs else if (xs - n) < n then (xs - n) else mod (xs - n) n
		
----------math.stlc----------

---------main.stlc----------

	import std
	import math
	import lists

	isPrime : Integer -> Boolean
	isPrime = fun x : Integer,
		if x <= 1 then
			False
		else if x == 2 then
			True
		else if (ilen (filter (range 2 x) (fun y : Integer, mod x y == 0)) == 0) then
			True
		else
			False

	twinPrimes : Integer -> [(Integer, Integer)]
	twinPrimes = fun n : Integer,
		if n < 5 then
			nil (Integer, Integer)
		else 
			let primes = filter (range 3 n) isPrime in
			let olderSiblings = map primes (fun x : Integer, x + 2) in
			let olderPrimes = filter siblings isPrime in
			let youngerPrimes = map olderPrimes (fun x : Integer, x - 2) in
			let twins = zip youngerPrimes olderPrimes in
			twins

	main : Integer
	main = twinPrimes 30
	
-----------main.stlc--------------

4 **Typing**

4.1 - 4.7 are implemented and may be tested from the REPL.

5. **Interpreter**

5.1 REPL works.

5.2 Evaluates main or any other function declaration that the user chooses.

5.3 Declarations made in the file where REPL is started from are.

5.4 Type of error is shown; source code line etc. not implemented.
