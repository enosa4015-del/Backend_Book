/* ============================================================
   THE BACKEND DEVELOPER BOOK — content, part 1 (chapters 0–4)
   Self-contained data. Loaded before the app engine.
   ============================================================ */
window.BOOK = {
  meta: {
    title: 'The Backend Developer Book',
    brand: 'Backend//Book',
    tagline: 'A different kind of tutorial',
    subtitle: 'PHP · SQL · Git · Laravel · APIs · Linux · Docker · Deployment — one path, six real projects.',
    hero: 'Learn the backend the way it actually works — by shipping.',
    levels: 13
  },
  chapters: []
};

(function () {
  function ch(number, id, title, section, summary, lessons) {
    window.BOOK.chapters.push({ number: number, id: id, title: title, section: section, summary: summary, lessons: lessons || [] });
  }

  function lesson(title, order, difficulty, eta, tags, summary, blocks) {
    return { title: title, order: order, difficulty: difficulty, estimated_time: eta, tags: tags, summary: summary, blocks: blocks || [] };
  }
  function p(s) { return { t: 'p', s: s }; }
  function h(s) { return { t: 'h', s: s }; }
  function h3(s) { return { t: 'h3', s: s }; }
  function code(lang, s) { return { t: 'code', lang: lang, s: s }; }
  function list(items) { return { t: 'list', items: items }; }
  function msg(kind, s) { return { t: 'msg', kind: kind, s: s }; }
  function quote(s) { return { t: 'quote', s: s }; }
  function challenge(s) { return { t: 'challenge', s: s }; }
  function quiz(q, o, a, e) { return { t: 'quiz', q: q, o: o, a: a, e: e }; }
  function next(to) { return { t: 'next', to: to }; }

  /* ============================================================
     CHAPTER 0 — INTRODUCTION
     ============================================================ */
  ch(0, 'intro', 'A Different Kind of Tutorial', 'intro',
    'Programming is a civilizational superpower, and this book is your engineer\u2019s manual to the backend. Written to be read from start to finish, it refuses to waste your time: every chapter builds real, usable skill, and the last chapters hand you a clear path to a junior job.',
    [
      lesson('The Problem', 1, 'Beginner', 8, ['mindset', 'learning'],
        'Courses feel productive. They are not. Here is the trap, and the way out.',
        [
          h('Watch a hundred hours. Build nothing.'),
          p('It happens like this: you find a course. Forty hours, promise of "zero to hero". You follow along, copy, nod. The teacher says "now you rebuild it yourself" and you skip that part, because there is always a next video. Then the course ends, the editor is empty, and you feel like a fraud.'),
          p('This is called tutorial hell, and it is not your fault — it is how almost every course is built. Video makes you feel busy. Watching is comfortable. Building is not.'),
          quote('An incredible programmer is just a person who kept the keyboard warm slightly longer than everyone else.'),
          msg('fun', 'The industry even has a name for the feeling after a course ends: "post-tutorial clarity". The clarity is: you learned to repeat, not to build.'),
          h('The way out'),
          list([
            'Learn by building things you care about, in public.',
            'Type every single example by hand. Never copy-paste code you are trying to learn.',
            'Break things on purpose. Fix them. That is experience.',
            'Trade watching hours for typing minutes.'
          ]),
          msg('warning', 'This book has almost no videos and zero copy-paste homework. If that makes you uncomfortable, good — the discomfort is the part that teaches you.')
        ]
      ),
      lesson('How to Learn', 2, 'Beginner', 8, ['mindset', 'learning'],
        'The rules that make practice stick — learn once, use forever.',
        [
          p('The single best way to learn anything in this book is to write it. Not to read it, not to watch it — to write it. Reading a recipe does not feed you; cooking does. Code is the same.'),
          h('The feedback loop'),
          p('Every lesson gives you two tools: a short exercise you do immediately and a quiz you answer honestly. The quiz is not a grade. It is a mirror. If you cannot answer, re-read the lesson, then try again.'),
          quote('Try it. Read it. Type it. Break it. Fix it. Explain it. That loop \u2014 not 40 hours of videos \u2014 is the whole course.'),
          quiz('The best way to learn a lesson in this book:', ['Watch a tutorial about it', 'Write the code yourself and break it on purpose', 'Save it for later'], 1, 'Type, run, break, fix, explain — that loop is the whole course. Watching does not feed; cooking does.'),
          msg('tip', 'Explain what you just learned to a rubber duck, or a friend, or an empty chat. If you cannot explain it simply, you have not understood it yet.'),
          h('The rules'),
          list([
            'Never let a week pass without running code.',
            'Type examples by hand. Retina is not muscle memory.',
            'The error message is the answer to 90% of your problems.',
            'Stop the moment you are confused. Solve it before moving on — confusion compounds.'
          ]),
          msg('fun', 'Rubber duck debugging is not a joke. Explaining your problem out loud to an inanimate object genuinely works, because it forces your brain to stop hand-waving.')
        ]
      ),
      lesson('How This Book Works', 3, 'Beginner', 6, ['learning'],
        'The anatomy of a lesson: sections, examples, exercises, and what "next" really means.',
        [
          p('Each chapter is a subject: PHP, Git, SQL, Laravel, APIs, Linux, Docker, deployment. Each subject is split into small lessons with three tags: difficulty, estimated time, and keywords.'),
          list([
            'difficulty — Beginner, Intermediate, or Advanced. Read it all, but let difficulty guide pacing.',
            'estimated_time — minutes, if you type everything. Faster is fine; slower is fine too.',
            'tags — what the lesson is really about, at a glance.'
          ]),
          p('Lessons end with a quiz or a challenge. Chapters point forward: the path is the fastest route from zero to a shipped backend.'),
          msg('info', 'Chapters 0 and 12 are time-boxed: the first gets you learning, the last gets you hired. Everything in between is the craft.'),
          challenge('Bookmark this page. Before you proceed to Chapter 1, install PHP and Git on your machine. When both `php -v` and `git --version` print versions, you are ready.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 1 — PROGRAMMING & THE WEB
     ============================================================ */
  ch(1, 'programming', 'Programming & the Web', 'programming',
    'Understand what programming actually is, then learn the building blocks every backend language shares: variables, conditions, loops, arrays and functions.',
    [
      lesson('What Is Programming?', 1, 'Beginner', 10, ['programming', 'basics'],
        'Programming is the art of giving computers precise instructions — and the web is the biggest program on Earth.',
        [
          h('A recipe with a scary name'),
          p('A program is a sequence of instructions. A computer follows them, top to bottom, exactly as written — no shortcuts, no human judgment, no mercy. The scary part is not the computer; it is that you finally have to be precise.'),
          p('That precision is a skill, and like any skill it grows with practice. You will not be precise today. You will be precise after fifty mistakes — and that is exactly how it works.'),
          h('Where the backend fits'),
          p('When you open a website, your browser asks a server for a page. The backend is the code that runs on that server: it saves your data, checks your password, sends the email. It is the part you never see and the part that actually runs the business.'),
          code('text', 'Browser (frontend)  \u2194  HTTP request/response  \u2194  Server (backend)\n                                                              \u2194  Database'),
          msg('info', 'The frontend is what the user touches. The backend is what happens when they do. This book is about the second part.')
        ]
      ),
      lesson('Languages: Why So Many?', 2, 'Beginner', 10, ['programming', 'languages'],
        'PHP, JavaScript, Python, Go… why the zoo? You do not need to learn them all — you need to understand why they differ.',
        [
          p('A programming language is a tool. A hammer and a screwdriver both fasten wood; you pick the one suited to the job. PHP powers most of the websites you use daily. JavaScript runs in every browser. Python and Go are strong in utilities and services.'),
          p('The good news: almost all languages share a grammar. Variables, conditions, loops, functions and arrays exist in every one of them with only cosmetic differences. Learn those in one language and you have learned them everywhere.'),
          code('php', '// Same idea, spelled differently\nlet age = 27;        // JavaScript\nage = 27             // Python\n$age = 27;           // PHP'),
          msg('tip', 'Do not learn five languages. Learn one, well enough to build, then borrow from others as you need them. Depth before breadth.')
        ]
      ),
      lesson('Variables', 3, 'Beginner', 10, ['programming', 'variables'],
        'A variable is a labeled box. Everything backend starts here.',
        [
          h('Labeled boxes'),
          p('A variable gives a name to a value so you can reuse it without rethinking it. Every program you write for the rest of this book will use dozens.'),
          code('php', '$name = "Ada";\n$age = 27;\necho "Hello, $name!";   // Hello, Ada!'),
          quiz('What does echo "Hello, $name!"; print when $name = "Ada"?', ['Hello, $name!', 'Hello, Ada!', 'Hello, !'], 1, 'Double-quoted strings interpolate variables, so PHP replaces $name with its value. Single-quoted strings would not.'),
          p('Names matter. Call a variable $userStatus instead of $x and future-you will still understand last-week-you.'),
          msg('warning', 'In PHP every variable begins with a $ sign. Forget it and PHP genuinely refuses to run — the error message will look terrifying until you learn to read it as a friend.')
        ]
      ),
      lesson('Control Structures', 4, 'Beginner', 12, ['programming', 'logic'],
        'Make the computer decide: if this, then that. The backbone of every password check, cart and feature flag.',
        [
          p('Programs are not just a straight line. They fork. A login form checks: if the password is right, let them in; otherwise, show an error. That single idea is what "doing things conditionally" means.'),
          code('php', '$password = $_POST["password"];\n\nif ($password === "s3cret") {\n    echo "Welcome back!";\n} else {\n    echo "Wrong password.";\n}'),
          quiz('Which comparison should a password check use in PHP?', ['== (loose)', '=== (strict)', '<>'], 1, 'Triple equals compares value and type. The loose == silently converts types and turns "0" into false.'),
          p('Compare values with == and ===. The triple form also checks the type of the value, which in PHP catches a whole family of sneaky bugs.'),
          msg('fun', 'PHP\u2019s loose comparisons are legendary: "0" == false and "0" == "abc" are both true. Triple equals is your armor.'),
          challenge('Open a PHP file. Create three variables ($book, $reading, $pages). If $reading is true, print "$book — reading!". Otherwise print "On the shelf." Practice breaking it on purpose and read the error.')
        ]
      ),
      lesson('Loops', 5, 'Beginner', 12, ['programming', 'loops'],
        'Do not repeat yourself more than once. Loops make the computer do the repeating.',
        [
          p('Writing the same line a hundred times is not programming; that is suffering. A loop writes it once and lets the computer decide how many times it runs.'),
          code('php', 'for ($i = 1; $i <= 5; $i++) {\n    echo "Iteration $i\\n";\n}\n\n$books = ["PHP", "SQL", "Docker"];\nforeach ($books as $book) {\n    echo "Reading: $book\\n";\n}'),
          msg('tip', 'foreach is the PHP loop you will use daily. If you have a list of things, you almost always want foreach.')
        ]
      ),
      lesson('Arrays', 6, 'Beginner', 10, ['programming', 'arrays'],
        'A bag of values in one box. Users, orders, comments — production is arrays everywhere.',
        [
          p('An array is a collection of values stored under one name. A list of books, a row of search results, a handful of tags: web applications are mostly arrays being filtered, sorted and turned into pages.'),
          code('php', '$tasks = ["Learn PHP", "Learn SQL", "Ship a project"];\n\necho $tasks[0];              // Learn PHP (index 0)\n$tasks[] = "Deploy it!";     // add at the end\n\n$user = ["name" => "Ada", "role" => "admin"];\necho $user["name"];          // Ada'),
          msg('info', 'PHP arrays do double duty: numeric-indexed like a list, and keyed like a dictionary. Both are just arrays. Database rows arrive already shaped this way.')
        ]
      ),
      lesson('Functions', 7, 'Beginner', 12, ['programming', 'functions'],
        'Name a chunk of work and call it by name. The single most important thing you can learn this week.',
        [
          h('The reusable recipe'),
          p('A function is a named block of code you can call again and again. Give it inputs, get an output — like a small machine inside your program.'),
          code('php', 'function greet($name) {\n    return "Hello, $name!";\n}\n\necho greet("Ada");     // Hello, Ada!\necho greet("Grace");   // Hello, Grace!'),
          p('A function that returns a value is the building block of testable code. If your logic lives inside functions, you can test each one alone, reuse it in another project and read the code like a table of contents.'),
          msg('tip', 'If you ever need the same 5 lines twice, stop and make a function. Three times? It was overdue.')
        ]
      ),
      lesson('Debugging: Reading Errors', 8, 'Beginner', 10, ['programming', 'debugging'],
        'Errors are not enemies. They are the computer explaining what it needs from you.',
        [
          p('Beginners read error messages as insults. Professionals read them as gifts, because the error message usually contains the exact file and line to fix.'),
          code('text', 'PHP Warning:  Undefined variable $name\nin /var/www/hello.php on line 4'),
          p('Three facts travel together: what went wrong, which file, which line. Nine times out of ten that is everything you need.'),
          h('A small ritual for stuck moments'),
          list([
            'Read the full message, out loud, start to finish.',
            'Go to the file and line it names.',
            'Ask: what did I expect, and what was actually there?',
            'Fix one small thing. Run again. Repeat.'
          ]),
          msg('danger', 'Never fix an error by pasting it into a search and copying the first answer blindly. Understand it first. The goal is not a green run; it is a new skill.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 2 — PHP, FROM ZERO
     ============================================================ */
  ch(2, 'php', 'PHP, From Zero', 'php',
    'Bootstrap your first PHP programs, then conquer the language one building block at a time — variables, strings, control structures, arrays, functions, forms, objects and JSON.',
    [
      lesson('Installing PHP', 1, 'Beginner', 15, ['php', 'setup'],
        'Get a working PHP environment with an error-reporting setup that will save you hours.',
        [
          p('You need PHP on your machine. On Windows, install XAMPP or Laragon; on macOS, Homebrew makes it painless; on Linux, your package manager has it. Any version from 8.1 up is perfect for this book.'),
          code('bash', '# Linux / macOS\nsudo apt install php php-cli  # (Debian/Ubuntu)\nbrew install php              # (macOS)\n\nphp -v                        # sanity check: prints the version'),
          msg('warning', 'After installing, open a terminal and run `php -v`. If a command is not found, PHP is installed but not on your PATH — a classic first hurdle. Search "<your OS> add php to PATH" once, fix it, done.'),
          msg('info', 'Enable verbose errors from day one so problems are visible: `php -d display_errors=1 script.php` during learning.')
        ]
      ),
      lesson('Hello, PHP!', 2, 'Beginner', 10, ['php', 'basics'],
        'Your first end-to-end PHP script: output, comments, and the difference between `echo` and `<?=`.',
        [
          p('PHP files live between <?php and ?>. Anything outside is treated as plain HTML — that very quietness is why PHP powered the web.'),
          code('php', '<?php\n// A comment: PHP ignores this line\n$message = "Hello, backend world!";\necho $message;\n\n// <?= is shorthand for echo — you will see it in templates\n?>\n<h1><?= $message ?></h1>'),
          msg('fun', 'A .php file can be an HTML page that secretly runs code in the middle. This is not a bug; it is the feature that made PHP the duct-tape of the web.'),
          challenge('Create hello.php with your name in a variable, a comment explaining the line, and a <?= that prints the variable inside an <h1>. Run it with `php hello.php`.')
        ]
      ),
      lesson('Variables & Types', 3, 'Beginner', 12, ['php', 'basics'],
        'Strings, integers, floats, booleans and null — and the type juggling traps to watch.',
        [
          code('php', '$name   = "Ada";      // string\n$age    = 27;         // integer\n$price  = 19.99;      // float\n$isCool = true;       // boolean\n$nothing = null;      // null: explicitly nothing'),
          p('PHP is loosely typed — a variable will switch types as you use it. Convenient until it is a bug farm. The snapshot rule: check types with var_dump($x) before you trust a value.'),
          code('php', '$a = "5";\n$b = 3;\necho $a + $b;     // 8 — PHP quietly converts "5"\nvar_dump($a);    // string(1) "5" — still a string'),
          quiz('What does echo $a + $b; print with $a = "5" and $b = 3?', ['53', '8', 'An error'], 1, 'PHP quietly converts the string "5" to 5 and adds: 8. Loose typing is convenient, and exactly why you check with var_dump.'),
          msg('warning', 'When reading input from forms or the URL, it arrives as a string even if it looks like a number. Cast it: `(int)$_GET["page"]` — or the index arithmetic will be off by one.')
        ]
      ),
      lesson('Strings', 4, 'Beginner', 12, ['php', 'strings'],
        'Concatenation, interpolation, and why you must escape user input from day one.',
        [
          code('php', '$name = "Ada";\n\necho "Hello, $name!";        // double quotes: interpolate\necho \'Hello, $name!\';        // single quotes: literal\n\necho "Hello, " . $name;      // concatenation\n\n$greeting = sprintf("Hi %s, you have %d new mails", $name, 3);\necho $greeting;              // Hi Ada, you have 3 new mails'),
          quiz('A single-quoted echo prints:', ['the literal text with $name', 'the interpolated value Ada', 'an error'], 0, 'Single quotes treat the text literally. Double quotes interpolate variables.'),
          p('Double-quoted strings let you drop variables right in; single-quoted are for literal text. sprintf is your friend when mixing the two with numbers.'),
          msg('danger', 'Never echo raw user input: `<?= $_GET["q"] ?>` invites XSS. Escape first with `htmlspecialchars($value)` whenever it came from a user and will print to a browser.\n\n    <?= htmlspecialchars($_GET["q"]) ?>')
        ]
      ),
      lesson('Control Structures in PHP', 5, 'Beginner', 12, ['php', 'logic'],
        'if, else, elseif, and the switch that reads like a menu.',
        [
          code('php', '$status = "active";\n\nif ($status === "active") {\n    echo "Welcome back!";\n} elseif ($status === "banned") {\n    echo "Account suspended.";\n} else {\n    echo "Please confirm your email.";\n}\n\n// Ternary — one-line if/else\n$label = $status === "active" ? "Online" : "Offline";'),
          p('The ternary is shorthand used heavily in templates. Read it right-to-left: condition ? true_value : false_value.'),
          msg('tip', 'Use `elseif` (one word) in PHP — `else if` also works but stylistically `elseif` is the convention.')
        ]
      ),
      lesson('Loops in PHP', 6, 'Beginner', 12, ['php', 'loops'],
        'for, while, foreach — the loops you will actually live in.',
        [
          code('php', 'for ($i = 1; $i <= 3; $i++) {\n    echo "number $i\\n";\n}\n\n$cart = ["PHP book", "SQL book", "Docker book"];\nforeach ($cart as $item) {\n    echo "checkout: $item\\n";\n}\n\n$user = ["name" => "Ada", "role" => "admin"];\nforeach ($user as $key => $value) {\n    echo "$key = $value\\n";\n}'),
          p('foreach comes in two flavors: with just the value, and with key => value when you need the key too. Database rows arrive as associative arrays, so this second flavor will be your daily bread.'),
          msg('info', 'Arrays in PHP are in reality ordered maps — which is why a database row maps so naturally onto one. You will see this again the moment you meet PDO.')
        ]
      ),
      lesson('Functions in PHP', 7, 'Beginner', 12, ['php', 'functions'],
        'Named, reusable work: parameters, defaults, return values and scope.',
        [
          code('php', 'function isAdult($age) {\n    return $age >= 18;\n}\n\nfunction present($name, $onSale = false) {\n    if ($onSale) {\n        return "Gift-wrapped: $name (on sale!)";\n    }\n    return "Gift-wrapped: $name";\n}\n\necho isAdult(19) ? "adult" : "minor";   // adult\necho present("roadmap", true);'),
          p('Variables inside a function are invisible outside it — scope. To get a value out, return it. Globals are the beginner trap that turns small programs into spaghetti; avoid them on principle.'),
          msg('tip', 'A function should do one thing and its name should advertise it. `validateEmail()` should validate; formatting output belongs in a different function.')
        ]
      ),
      lesson('Forms: GET & POST', 8, 'Intermediate', 20, ['php', 'forms'],
        'The moment your PHP starts listening. Read data the browser sends you — the crux of the backend.',
        [
          p('A backend exists to act on what users send. Two channels exist: GET, which sticks data in the URL, and POST, which sends it inside the request body, unseen in the address bar.'),
          code('html', '<form action="handle.php" method="post">\n  <input type="text" name="username" required>\n  <input type="email" name="email" required>\n  <button type="submit">Sign up</button>\n</form>'),
          code('php', '<?php\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $username = trim($_POST["username"]);\n    $email    = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);\n\n    if ($email === false) {\n        echo "Please enter a valid email address.";\n    } else {\n        echo "Welcome, " . htmlspecialchars($username) . "!";\n    }\n}'),
          quiz('A form with method="post" sends its fields:', ['in the URL', 'in the request body', 'as a cookie'], 1, 'POST sends fields in the request body, invisible in the address bar. GET appends them to the URL instead.'),
          p('Always treat input with suspicion: trim whitespace, validate emails, escape on output. A form you cannot trust is a character who never learned boundaries.'),
          msg('danger', 'Never concatenate user input into a SQL query directly. Input that reaches SQL is called SQL injection, and one quote is enough to test whether the door is open.')
        ]
      ),
      lesson('Debugging PHP', 9, 'Intermediate', 15, ['php', 'debugging'],
        'Use PHP\u2019s error reporting like a pro: dev settings, var_dump, and the "it worked a minute ago" ritual.',
        [
          code('php', 'ini_set(\'display_errors\', \'1\');\nini_set(\'display_startup_errors\', \'1\');\nerror_reporting(E_ALL);\n\n// quick logs while learning\nvar_dump($_POST);\nerror_log("reached the update branch");'),
          p('In dev you want everything shown; in production you want everything logged and nothing shown. One way or another, the answer is diagnostic output — you just decide who may see it.'),
          msg('tip', 'var_dump() beats echo for investigating, because it tells you the type and length too. Add a `die();` after it to stop the script at that line — a classic "print and halt" move.')
        ]
      ),
      lesson('Objects: Your First Classes', 10, 'Intermediate', 20, ['php', 'oop'],
        'Bundle data and behavior together with classes — the vocabulary Laravel and every modern PHP library speaks.',
        [
          code('php', 'class Book {\n    public string $title;\n    public int $pages;\n\n    public function __construct(string $title, int $pages) {\n        $this->title = $title;\n        $this->pages = $pages;\n    }\n\n    public function describe(): string {\n        return "{$this->title} ({$this->pages} pages)";\n    }\n}\n\n$book = new Book("The Backend Developer Book", 400);\necho $book->describe();'),
          p('A class is a blueprint; an object is the thing you build with it. Methods are functions that live inside. PHP supports typed properties and return types now, which make your mistakes show up quickly and loudly.'),
          msg('fun', 'The arrows look like you are pointing at the object\u2019s property: `$book->title`. Read it as "of the book, title".')
        ]
      ),
      lesson('JSON: The Web\u2019s Lingua Franca', 11, 'Intermediate', 15, ['php', 'json'],
        'Every API you ever consume reads JSON. PHP reads and writes it in one line.',
        [
          p('JSON is a text format for data: curly braces and square brackets holding keys and values, exactly the shape of PHP arrays. It is what your browser and the backend exchange.'),
          code('php', '$user = ["name" => "Ada", "role" => "admin"];\n\n$json = json_encode($user);\n// {"name":"Ada","role":"admin"}\n\n$back = json_decode($json, true);\n// ["name" => "Ada", "role" => "admin"]\nvar_dump($back);'),
          quiz('json_decode($json, true) returns:', ['an object', 'an associative array', 'a string'], 1, 'The second argument asks for associative arrays. Without it, PHP returns objects.'),
          msg('tip', 'Pass true as the second argument to json_decode to get associative arrays instead of objects — the style most PHP developers prefer for day-to-day work.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 3 — GIT
     ============================================================ */
  ch(3, 'git', 'Git: Your Time Machine', 'git',
    'Version control gives every project an undo button for days. Become fluent enough that you never fear breaking code again.',
    [
      lesson('Why Version Control', 1, 'Beginner', 8, ['git', 'basics'],
        'The "one more final draft" problem, and how git keeps a journal instead.',
        [
          p('Everyone has done it: report_final_v2_reallyfinal.docx. Developers solved it with version control, and git is the tool nearly the whole industry uses.'),
          p('Git keeps a complete history of every change, lets you branch experiments without touching the main line, and syncs a shared copy between machines and teammates. When a deploy breaks, git lets you rewind exactly.'),
          quote('Version control is a time machine, a diary and a safety net in one binary. Every professional team uses it.'),
          msg('warning', 'git is wildly less scary than its reputation. You need about ten commands in daily life. Master those, not the whole manual.')
        ]
      ),
      lesson('Your First Repo & Commits', 2, 'Beginner', 15, ['git', 'basics'],
        'Init, status, add, commit — the four commands of personal safety.',
        [
          code('bash', 'mkdir my-project && cd my-project\ngit init\n* create or edit files *\ngit status              # what changed?\ngit add .               # stage changes\ngit status              # now they are staged\ngit commit -m "first commit"\ngit log                 # your history'),
          quiz('What does git add . do?', ['Saves a permanent snapshot', 'Moves changes into the staging area', 'Uploads to GitHub'], 1, 'git add stages; git commit freezes into history; git push sends to a remote.'),
          p('The mental model: the working tree is your files. `git add` moves changes into the staging area; `git commit` freezes them into history. `git status` tells you which step you are on.'),
          msg('tip', 'Write commit messages as a sentence finishing "This commit will…": "fix login redirect", "add docker-compose", "make index faster". Your future self will thank you.')
        ]
      ),
      lesson('Branches', 3, 'Intermediate', 15, ['git', 'branching'],
        'Experiment freely — branches are copy rooms for your codebase.',
        [
          p('A branch is a parallel copy of your project. You build a feature over there, and only when it is solid do you merge it back. The main branch stays shippable the whole time.'),
          code('bash', 'git checkout -b feat/login   # create + switch\ngit branch                  # see branches (* = current)\n\n# work, commit, work, commit...\n\ngit checkout main           # back to the safe line\ngit merge feat/login        # fold the feature in\ngit branch -d feat/login    # delete the ship, it sailed'),
          quiz('Which command creates a branch and switches to it in one step?', ['git branch new', 'git checkout -b feat/x', 'git merge feat/x'], 1, 'git checkout -b name creates the branch and drops you onto it.'),
          msg('info', 'In a real team you will almost never merge straight into main — a pull request gets reviewed. But the mechanics of merge are what this lesson is about.')
        ]
      ),
      lesson('Remotes: GitHub', 4, 'Intermediate', 15, ['git', 'github'],
        'push and pull: your repo lives on your machine and in the cloud, and they stay in sync.',
        [
          code('bash', '# connect your local repo to a GitHub repo\ngit remote add origin https://github.com/you/my-project.git\ngit push -u origin main     # first push: set upstream\n\n# on another machine, or after a teammate pushes\ngit pull origin main        # bring their work in'),
          p('remote add points at a home on the internet; push sends your commits there; pull brings theirs down. Everything else is confirmation.'),
          msg('danger', 'Never push secrets. Add a .gitignore with .env, vendor/, node_modules/ before your first commit — a leaked .env with production credentials is a nightmare.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 4 — SQL
     ============================================================ */
  ch(4, 'sql', 'SQL: Talking to Databases', 'sql',
    'SQL is how the server remembers. Learn to speak the language every real database answers to — enough to power real apps.',
    [
      lesson('What Is a Database?', 1, 'Beginner', 10, ['sql', 'databases'],
        'Where state actually lives — tables, rows, columns, and why we structure data at all.',
        [
          p('A variable forgets when a request ends. A database remembers for years. The mental model is an old spreadsheet with superpowers: tables of rows and columns, indexed for instant lookups, safe from crashes, and queried with a language called SQL.'),
          code('sql', 'CREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(255) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);'),
          msg('info', 'MySQL and MariaDB are the classic pairing with PHP. The SQL you write for one works on the other.')
        ]
      ),
      lesson('SELECT: Reading Data', 2, 'Beginner', 15, ['sql', 'queries'],
        'The most-used command in the world: querying rows, filtering with WHERE, ordering and limiting.',
        [
          code('sql', 'SELECT id, name, email FROM users;\n\nSELECT * FROM users WHERE role = \'admin\';\n\nSELECT name FROM users\nWHERE created_at >= \'2024-01-01\'\nORDER BY created_at DESC\nLIMIT 10;'),
          p('SELECT says what to fetch, FROM where, WHERE which rows qualify, ORDER BY the sort, LIMIT how many. Read them in that order and SQL stops being hieroglyphic.'),
          msg('tip', 'Avoid SELECT * in real code: name the columns you need. It is clearer and faster, and when the table grows, your code does not silently grow too.')
        ]
      ),
      lesson('INSERT, UPDATE, DELETE', 3, 'Beginner', 15, ['sql', 'data'],
        'The other three quarters of CRUD.',
        [
          code('sql', 'INSERT INTO users (name, email) VALUES (\'Ada\', \'ada@example.com\');\n\nUPDATE users SET name = \'Ada Lovelace\' WHERE id = 1;\n\nDELETE FROM users WHERE id = 1;'),
          msg('danger', 'An UPDATE without a WHERE updates every row. A DELETE without a WHERE deletes every row. Both are correct SQL and both end days. Write the WHERE first when you are nervous.'),
          msg('warning', 'In production you will rarely hard-delete. Soft delete — a deleted_at flag — keeps your data recoverable and your audit trail intact.')
        ]
      ),
      lesson('JOINs', 4, 'Intermediate', 20, ['sql', 'joins'],
        'Where the relational model earns its name: combine tables around a key.',
        [
          p('A user has many posts; a post belongs to a user. Instead of duplicating the user\u2019s name inside every post, the post stores the user\u2019s id — a foreign key — and JOIN brings them together at read time.'),
          code('sql', 'SELECT posts.title, users.name AS author\nFROM posts\nJOIN users ON posts.user_id = users.id\nORDER BY posts.created_at DESC;'),
          p('INNER JOIN keeps only matching rows. LEFT JOIN keeps all rows from the left table even if there is no match (posts whose author was deleted). You will reach for LEFT JOIN constantly.'),
          msg('fun', 'Foreign keys are like friendships: a post holds the user\u2019s id and says "my author lives in the users table, go ask them." JOIN is introducing the two tables.')
        ]
      ),
      lesson('Indexes', 5, 'Intermediate', 15, ['sql', 'performance'],
        'Blazing-fast lookups, for the cost of small write overhead.',
        [
          p('An index is the index at the back of a book. Without it, finding a row means reading every page. With it, the database jumps straight to the right spot.'),
          code('sql', 'CREATE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_posts_user_id ON posts(user_id);'),
          msg('tip', 'Index the columns you filter and join on: WHERE, JOIN keys, and ORDER BY columns. Indexing everything is overkill — start small, measure, index what the queries use.')
        ]
      ),
      lesson('SQL Injection — Know Your Enemy', 6, 'Intermediate', 15, ['sql', 'security'],
        'The most famous backend attack. Understand it, because you will now be judged on preventing it.',
        [
          p('If you paste user input directly into a query, the user becomes part of your SQL. A single quote can break out of the string and run extra SQL.'),
          code('sql', "-- Vulnerable: user types:  ') OR '1'='1\nSELECT * FROM users WHERE email = '' + input + '';\n-- ' backticks are drama, prepared statements are the cure"),
          p('The defense is a prepared statement: send the query skeleton and the data separately, so the database cannot confuse one for the other. PDO makes this one line.'),
          code('php', '$stmt = $pdo->prepare(\'SELECT * FROM users WHERE email = ?\');\n$stmt->execute([$email]);\n$user = $stmt->fetch();'),
          msg('danger', 'Every value that comes from a user or the URL is hostile until proven otherwise. Concatenating it into SQL is how databases get dropped, dumped and ransomed.')
        ]
      )
    ]
  );
})();