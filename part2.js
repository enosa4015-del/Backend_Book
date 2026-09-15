/* ============================================================
   THE BACKEND DEVELOPER BOOK — content, part 2 (chapters 5–8)
   ============================================================ */
(function () {
  function ch(number, id, title, section, summary, lessons) {
    window.BOOK.chapters.push({ number: number, id: id, title: title, section: section, summary: summary, lessons: lessons || [] });
  }
  function lesson(title, order, difficulty, eta, tags, summary, blocks) {
    return { title: title, order: order, difficulty: difficulty, estimated_time: eta, tags: tags, summary: summary, blocks: blocks || [] };
  }
  function p(s) { return { t: 'p', s: s }; }
  function h(s) { return { t: 'h', s: s }; }
  function code(lang, s) { return { t: 'code', lang: lang, s: s }; }
  function list(items) { return { t: 'list', items: items }; }
  function msg(kind, s) { return { t: 'msg', kind: kind, s: s }; }
  function quote(s) { return { t: 'quote', s: s }; }
  function quiz(q, o, a, e) { return { t: 'quiz', q: q, o: o, a: a, e: e }; }
  function challenge(s) { return { t: 'challenge', s: s }; }

  /* ============================================================
     CHAPTER 5 — LARAVEL
     ============================================================ */
  ch(5, 'laravel', 'Laravel: PHP With Superpowers', 'laravel',
    'Frameworks are not magic. They are the collected best practices of thousands of apps, organized for you — and Laravel is PHP\u2019s flagship. MVC, routing, Eloquent and Blade, one step at a time.',
    [
      lesson('Why a Framework', 1, 'Beginner', 10, ['laravel', 'basics'],
        'Stop re-inventing password hashing. A framework is the shared toolbox, Laravel is the toolbox you will love.',
        [
          p('You could write every feature by hand — hashing passwords, routing requests, talking to databases, validating forms. You would be writing the same code everyone else writes, but slower and with more bugs.'),
          p('A framework packages those battle-tested solutions into one coherent set of conventions. Laravel is PHP\u2019s most popular, and its philosophy is that developer experience matters: readable code, friendly errors, sane defaults.'),
          quote('The framework is the skeleton of the app; your business logic is the muscle. The happier the skeleton, the easier the muscles are to build and move.'),
          msg('fun', 'Laravel bills itself as "the PHP framework for web artisans." Use the tools it gives you and you get to feel like one.')
        ]
      ),
      lesson('Installing Laravel', 2, 'Intermediate', 20, ['laravel', 'setup'],
        'Composer, the project generator, and the local server that reloads for you.',
        [
          p('Laravel installs through Composer, PHP\u2019s package manager. If composer is not around yet, it is one small installer away. Then:'),
          code('bash', 'composer create-project laravel/laravel my-app\ncd my-app\nphp artisan serve        # -> http://localhost:8000'),
          p('artisan is Laravel\u2019s command-line nurse practitioner: it generates files, runs migrations, starts servers. You will live with it.'),
          code('bash', 'php artisan list        # every available command\nphp artisan make:model Post -m    # model + migration together'),
          msg('warning', 'Composer requires PHP with a few extensions (mbstring, openssl, pdo). If the install complains, install the extensions the error names, then re-run.')
        ]
      ),
      lesson('MVC in One Breath', 3, 'Beginner', 12, ['laravel', 'mvc'],
        'The pattern under almost every web app: Model, View, Controller. Understand it, and every framework starts to look familiar.',
        [
          list([
            'Model — talks to the database. In Laravel, named Eloquent.',
            'View — what the user sees. In Laravel, named Blade.',
            'Controller — the manager that takes a request, asks the model for data, hands it to a view.'
          ]),
          code('text', 'Request -> Route -> Controller -> Model (data)\n                         -> View (HTML) -> Response'),
          p('The point of the pattern is separation: your database code does not live inside your HTML. Change one layer without breaking the other two.'),
          msg('info', 'You already know everything MVC is made of: functions (controllers), arrays (models), and the echo-with-<?= templating you did in Chapter 2 (views). Laravel just organizes it.')
        ]
      ),
      lesson('Routing', 4, 'Beginner', 15, ['laravel', 'routing'],
        'The map of the app: which URL leads to which behavior.',
        [
          code('php', 'use Illuminate\\Support\\Facades\\Route;\n\nRoute::get(\'/\', function () {\n    return \'Homepage\';           // literal response\n});\n\nRoute::get(\'/about\', function () {\n    return view(\'about\');         // a Blade view\n});\n\nRoute::get(\'/users/{user}\', fn ($user) => "Profile of $user");'),
          p('The route file lives in routes/web.php. It declares URLs and the code that answers them. {user} is a route parameter — the dynamic part a real app cares about.'),
          msg('tip', 'Read a route as a sentence: "When someone GETs /about, respond with the about view." A one-line contract per URL.')
        ]
      ),
      lesson('Controllers', 5, 'Intermediate', 15, ['laravel', 'controllers'],
        'Move logic out of the route and into a class — the way the pattern wants.',
        [
          code('bash', 'php artisan make:controller UserController'),
          code('php', 'class UserController extends Controller\n{\n    public function index()\n    {\n        $users = User::all();\n        return view(\'users.index\', compact(\'users\'));\n    }\n\n    public function show($id)\n    {\n        return view(\'users.show\', [\n            \'user\' => User::findOrFail($id),\n        ]);\n    }\n}'),
          code('php', 'Route::get(\'/users\', [UserController::class, \'index\']);\nRoute::get(\'/users/{id}\', [UserController::class, \'show\']);'),
          p('The controller receives a request, gathers the data the view needs, and returns a response. Keep controllers thin: they arrange, they do not do heavy lifting themselves.')
        ]
      ),
      lesson('Eloquent: Models', 6, 'Intermediate', 20, ['laravel', 'eloquent'],
        'SQL without writing SQL: the model *is* the table, and its methods are the queries.',
        [
          code('php', 'class Post extends Model\n{\n    protected $fillable = [\'title\', \'body\', \'user_id\'];\n}'),
          code('php', '$post = Post::where(\'published\', true)\n    ->orderBy(\'created_at\', \'desc\')\n    ->get();\n\n$post = Post::findOrFail($id);   // 404 if missing\n\nPost::create([\'title\' => $title, \'body\' => $body]);'),
          quiz('Post::findOrFail($id) returns when the id is missing:', ['null', 'a 404 response', 'an empty model'], 1, 'findOrFail aborts with a 404 when the row is not found — exactly what a web page wants.'),
          msg('warning', '$fillable is Laravel\u2019s safety rail against mass assignment: only listed fields may be filled via array. Leave it out and a malicious form can set fields it should not touch.')
        ]
      ),
      lesson('Migrations', 7, 'Intermediate', 15, ['laravel', 'database'],
        'Database schema as code: versioned, reviewable and reproducible.',
        [
          code('bash', 'php artisan make:migration create_posts_table'),
          code('php', 'Schema::create(\'posts\', function (Blueprint $table) {\n    $table->id();\n    $table->foreignId(\'user_id\')->constrained()->onDelete(\'cascade\');\n    $table->string(\'title\');\n    $table->text(\'body\');\n    $table->boolean(\'published\')->default(false);\n    $table->timestamps();\n});'),
          code('bash', 'php artisan migrate'),
          p('Your database is built from code that lives in your repo. A teammate (or a fresh server) runs the same migrations and gets the same schema. That is reproducibility — and it is what makes deploys not-an-act-of-heroism.'),
          msg('tip', 'Make migrations early and often, per feature. A migration that rewrites an old one is a smell — write a new migration instead, so the history stays a history.')
        ]
      ),
      lesson('Blade: Views', 8, 'Intermediate', 20, ['laravel', 'blade'],
        'Templates with superpowers: layouts, loops, and escaping that is automatic.',
        [
          code('blade', '{{-- resources/views/layouts/app.blade.php --}}\n<html>\n<head><title>@yield(\'title\')</title></head>\n<body>\n  @yield(\'content\')\n</body>\n</html>'),
          code('blade', '{{-- resources/views/posts/index.blade.php --}}\n@extends(\'layouts.app\')\n@section(\'title\', \'Latest posts\')\n\n@section(\'content\')\n    @foreach ($posts as $post)\n        <article>\n            <h2>{{ $post->title }}</h2>\n            <p>{{ $post->body }}</p>\n        </article>\n    @endforeach\n@endsection'),
          quiz('What does {{ $title }} do in Blade?', ['Runs PHP and escapes the output', 'Runs raw unescaped HTML', 'Does nothing'], 0, '{{ }} echoes AND escapes against XSS. Use {!! !!} only when raw HTML is truly intended.'),
          p('{{ $var }} echoes AND automatically escapes — XSS protection by default, for free. That is what the echo-with-htmlspecialchars of Chapter 2 becomes once a professional template engine takes over.'),
          msg('info', 'If you remember Chapter 2\u2019s `<?= htmlspecialchars(...) ?>` dance, Blade is that choreography baked in: `{{ }}` does both steps for you.')
        ]
      ),
      lesson('Forms, Validation & CSRF', 9, 'Intermediate', 25, ['laravel', 'forms'],
        'The full backend ceremony of a form in Laravel: CSRF token, validation rules, old input, error display.',
        [
          code('blade', '<form method="POST" action="{{ route(\'posts.store\') }}">\n    @csrf\n    <input name="title" value="{{ old(\'title\') }}">\n    <input name="body">\n    <button>Publish</button>\n</form>'),
          code('php', 'public function store(Request $request)\n{\n    $validated = $request->validate([\n        \'title\' => [\'required\', \'max:255\'],\n        \'body\'  => [\'required\'],\n    ]);\n\n    Post::create($validated);\n\n    return redirect()->route(\'posts.index\')\n        ->with(\'status\', \'Post published!\');\n}'),
          quiz('Why does every POST form need @csrf?', ['To speed up submission', 'To stop forged cross-site requests in a user\u2019s name', 'To pass Laravel validation'], 1, 'CSRF tokens let the server tell its own forms apart from malicious ones sent by other sites.'),
          p('@csrf embeds a token so Laravel can tell a legit form from a forged cross-site request. validate() does the checking; redirect back with errors is automatic; old(\'title\') refills the field after a failed attempt.'),
          msg('danger', 'CSRF attacks make other websites send requests as your users. Laravel\u2019s token is cheap and non-negotiable: every POST form in your app needs @csrf.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 6 — WHAT IS AN API?
     ============================================================ */
  ch(6, 'api', 'What Is an API?', 'api',
    'Your backend, talking to machines. Understand HTTP, JSON, REST and the vocabulary every API conversation uses — then build and consume your first one.',
    [
      lesson('What Is an API?', 1, 'Beginner', 10, ['api', 'concepts'],
        'The waiter between the app and the data — and the contract that makes it work.',
        [
          p('An API (Application Programming Interface) is the menu the kitchen publishes. The kitchen is the backend; the menu lists the dishes (endpoints); the customer (your app, or someone else\u2019s) orders and the kitchen returns exactly what the menu promised.'),
          p('Web APIs speak HTTP and JSON: a request in, a response out, nothing hidden between. When people say "integrate with the weather API" or "our mobile app talks to our REST API", they mean this.'),
          quote('An API is a contract: if you send a valid request, I promise a valid response. Both sides know what valid means.'),
          msg('fun', 'Every time you check the weather, book a flight, or buy a ticket, an API somewhere is doing push-ups on your behalf.')
        ]
      ),
      lesson('HTTP in One Lesson', 2, 'Beginner', 15, ['api', 'http'],
        'The protocol under every web page and API call: methods, URLs, headers and status codes.',
        [
          p('HTTP is a polite conversation: a client asks, a server answers. Four verbs do almost everything, and five status ranges tell you what happened.'),
          list([
            'GET — read something. Never changes state.',
            'POST — create something new.',
            'PUT / PATCH — update something (whole vs. partial).',
            'DELETE — remove something.'
          ]),
          list([
            '2xx — it worked (200 OK, 201 Created).',
            '3xx — redirect, go look over there (301, 302).',
            '4xx — your fault: 400 bad request, 401 unauthenticated, 403 forbidden, 404 not found, 422 unprocessable.',
            '5xx — my fault: 500 server error, 503 unavailable.'
          ]),
          quiz('401 vs 403: which means the user is not logged in?', ['403', '401'], 1, '401 = authentication missing. 403 = authenticated but not allowed to do that.'),
          p('The URL says what, the method says what kind of action, the status code says how it went, and headers carry metadata (content type, auth tokens, caching rules).'),
          msg('tip', 'Learn 404, 401/403 and 422 by heart — you will meet them weekly. Reading them correctly halves debugging time.')
        ]
      ),
      lesson('JSON: The API Dialect', 3, 'Beginner', 10, ['api', 'json'],
        'The shape of every API response, and why it maps so cleanly onto your PHP arrays.',
        [
          code('json', '{\n  "id": 1,\n  "title": "Learning APIs",\n  "tags": ["backend", "http"],\n  "author": { "name": "Ada" },\n  "published_at": "2026-01-12T09:00:00Z"\n}'),
          p('Objects in {}, arrays in []. Strings, numbers, booleans and null — that is the whole spec. Your PHP arrays and Eloquent models serialize to this shape with json_encode($data).'),
          msg('info', 'Dates in APIs travel as ISO 8601 strings with a timezone — "2026-01-12T09:00:00Z". Learn the shape; you will be parsing it daily.')
        ]
      ),
      lesson('Your First REST API', 4, 'Intermediate', 25, ['api', 'laravel'],
        'Spin up a real Laravel API: routes, a controller, JSON responses, and the showstopper helper — route model binding.',
        [
          code('bash', 'php artisan make:controller Api\\PostController --model=Post\nphp artisan make:resource PostResource'),
          code('php', 'Route::prefix(\'api\')->group(function () {\n    Route::get(\'/posts\', [Api\\PostController::class, \'index\']);\n    Route::get(\'/posts/{post}\', [Api\\PostController::class, \'show\']);\n});'),
          code('php', 'public function index()\n{\n    return PostResource::collection(Post::with(\'user\')->latest()->paginate(15));\n}\n\npublic function show(Post $post)   // {post} resolves the model\n{\n    return new PostResource($post);\n}'),
          p('Route model binding turns the :id in the URL into a real Post automatically — 404 when it does not exist. Resources keep your JSON shape in one obvious file instead of sprinkled everywhere.'),
          msg('tip', 'Test with a tool like Postman, or curl on the command line — two free ways to poke at your own API like a stranger would.')
        ]
      ),
      lesson('Consuming an API', 5, 'Intermediate', 20, ['api', 'requests'],
        'Your backend reaching out: fetch weather, pay a gateway, call your own endpoints.',
        [
          code('php', '$client = new \\GuzzleHttp\\Client();\n\n$response = $client->get(\'https://api.example.com/weather/city?q=Paris\', [\n    \'headers\' => [\'Authorization\' => \'Bearer \' . $token],\n]);\n\n$data = json_decode((string) $response->getBody(), true);\n\necho $data[\'main\'][\'temp\'];'),
          quiz('A third-party API returns an unexpected shape. Best move:', ['Trust the provider and cache forever', 'Validate the structure before rendering or saving', 'Ignore the payload'], 1, 'Treat API responses as input — validate the shape you receive before you use it.'),
          p('The pattern never changes: build the request, add headers, decode the JSON, handle failure. Real integrations go down; your app should fail gracefully, not fatally.'),
          msg('danger', 'Treat every third-party API as untrusted input. Validate the shape you receive before you render or persist it — their schema is a rumor until you check.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 7 — AUTHENTICATION & SECURITY
     ============================================================ */
  ch(7, 'auth', 'Authentication & Security', 'security',
    'Identity and trust: how a system knows who you are, how it keeps you out when you must not enter, and the handful of attacks every backend has stayed up late worrying about.',
    [
      lesson('Hashing Passwords', 1, 'Beginner', 15, ['security', 'passwords'],
        'Never store raw passwords. Hash them, and let the framework pick the algorithm.',
        [
          p('Storing passwords as plaintext is a crime against future-you. Instead, store a one-way hash — the same input always makes the same output, and you can never go backward.'),
          code('php', '$hash = password_hash($password, PASSWORD_BCRYPT);\n// $2y$10$... irreversible fingerprint\n\nif (password_verify($password, $hash)) {\n    // login ok\n}'),
          quiz('Why hash passwords instead of storing them plain?', ['It saves disk space', 'A leaked hashed database is useless without the plaintext', 'Logins become faster'], 1, 'Hashing is one-way. Slow algorithms like bcrypt make brute-forcing a leaked dump expensive.'),
          h('Why this defeats the dump'),
          p('If a database with hashes leaks, the attacker gets useless noise, not passwords. Bcrypt is deliberately slow, so brute-forcing is expensive. Let PHP choose the current best algorithm — and never design your own crypto.'),
          msg('danger', 'The only acceptable hash for passwords is a slow, salted one — bcrypt, argon2. SHA and MD5 are fast, and fast is exactly what attackers want.')
        ]
      ),
      lesson('Sessions & Cookies', 2, 'Intermediate', 15, ['security', 'sessions'],
        'HTTP forgets everyone. Sessions and cookies are how the server remembers it was you.',
        [
          p('HTTP is stateless: every request arrives fresh, with no memory of yesterday. A cookie is a small token the browser keeps, and a session is the server-side drawer that token opens.'),
          code('php', 'session_start();\n$_SESSION[\'user_id\'] = $user->id;   // remember login\n\n// on a later request:\nif (isset($_SESSION[\'user_id\'])) { /* still logged in */ }'),
          p('In Laravel this is already wired: auth() remembers you, session middleware handles the drawer, and the cookie you receive is just an opaque key.'),
          msg('warning', 'Never trust what comes from a cookie — it is a key, not a biography. Always use the session store for state, and re-check permissions on every sensitive request.')
        ]
      ),
      lesson('Laravel Auth', 3, 'Intermediate', 20, ['laravel', 'auth'],
        'Scaffold authentication in seconds, then understand precisely what it guards.',
        [
          code('bash', 'composer require laravel/breeze --dev\nphp artisan breeze:install blade\nnpm install && npm run dev\nphp artisan migrate'),
          p('Breeze lays down login, registration, password reset and email verification — working code you then read and adapt. Lock routes down with middleware:'),
          code('php', 'Route::middleware([\'auth\'])->group(function () {\n    Route::get(\'/dashboard\', [DashboardController::class, \'index\']);\n    Route::get(\'/posts/{post}/edit\', [PostController::class, \'edit\']);\n});'),
          p('auth middleware means: only logged-in users may pass. The moment there is also editing, the editor needs more than the front door — it needs ownership checks too.'),
          msg('tip', '"Logged in" and "allowed to edit this specific post" are two different locks. Auth opens the front door; authorization checks the room list.')
        ]
      ),
      lesson('Tokens & APIs', 4, 'Intermediate', 20, ['auth', 'api'],
        'When there is no session cookie (mobile apps, SPAs), authenticate with tokens: Laravel Sanctum.',
        [
          code('bash', 'composer require laravel/sanctum\nphp artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"\nphp artisan migrate'),
          code('php', '$token = $user->createToken(\'mobile\')->plainTextToken;\n// Bearer <token> in the Authorization header\n\nRoute::middleware(\'auth:sanctum\')->get(\'/api/user\', function (Request $r) {\n    return $r->user();\n});'),
          p('A token is a password the server issued, revocable per device. Stateless for your API, revocable for you. Sanctum is the lightest sane option before you need OAuth-complete weaponry.'),
          msg('danger', 'Tokens are secrets. Store them server-side, send them only over HTTPS, and revoke them on logout and on suspicion. A leaked token is a leaked session.')
        ]
      ),
      lesson('The Usual Attacks', 5, 'Intermediate', 20, ['security', 'attacks'],
        'The four attacks that matter for a web backend — in words you will remember.',
        [
          list([
            'SQL Injection — user input becomes SQL. Defeated by prepared statements. (Chapter 4.)',
            'XSS — user input becomes HTML/JS on the page. Defeated by escaping output (Blade\u2019s {{ }} does it automatically).',
            'CSRF — another site forges requests in your user\u2019s name. Defeated by the @csrf token on every state-changing form.',
            'Mass Assignment — extra fields sneak into a create(). Defeated by $fillable and validation allow-lists.'
          ]),
          quiz('Which attack is defeated by escaping all output at render time?', ['SQL injection', 'XSS', 'CSRF'], 1, 'XSS happens when user input becomes script on the page. Escaping every output turns their script into text.'),
          p('One idea threads through all four: input was not input and output was not output until you decided. Validate everything in, escape everything out, and never concatenate user data into code.'),
          msg('fun', 'Security is not a feature you bolt on at the end; it is a reflex you build from the first line. All four attacks above are defeated by habits you already met in this book.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 8 — LINUX
     ============================================================ */
  ch(8, 'linux', 'Linux: Own the Server', 'linux',
    'Every backend eventually ships to a Linux server. Learn the terminal\u2019s native tongue — navigation, files, permissions, processes — and stop being a passenger on your own machine.',
    [
      lesson('Why Linux', 1, 'Beginner', 8, ['linux', 'basics'],
        'The server room where your app will live, and why familiarity with it is a hiring signal.',
        [
          p('Almost every web server runs Linux. It is free, boringly stable, and built for automation. The deploy you do in Chapter 10 lands on Linux. The container in Chapter 9 wraps Linux.'),
          p('You do not need to become a sysadmin. You need enough that a terminal feels like home, not like a haunted basement — and that alone sets you apart from a crowd of framework-only developers.'),
          quote('The terminal is not a rival to the mouse; it is a second language. The backend world often speaks only this one.'),
          msg('fun', 'macOS is Linux\u2019s cousin (both are Unix); nearly everything in this chapter works there too. Windows users: WSL translates, and Docker for Desktop gives you a Linux VM on demand.')
        ]
      ),
      lesson('The Terminal Is Just a Window', 2, 'Beginner', 10, ['linux', 'terminal'],
        'Commands with flags: the first ten-minute disarming lesson.',
        [
          code('bash', 'pwd        # where am I?\nls         # what is here?  (ls -la: everything, detailed)\ncd /var    # go to /var\ncd ..      # go up one level\nwhoami     # who am I in this machine\u2019s eyes?'),
          p('Remember the shape of a command: verb + options + arguments. `ls` is the verb; `-la` are options; `/var` would be an argument. The manual is always one `man <command>` away.'),
          msg('tip', 'Press Tab to autocomplete and the up-arrow to repeat. Two habits that make the terminal feel 200% more comfortable.')
        ]
      ),
      lesson('Files & Permissions', 3, 'Intermediate', 20, ['linux', 'files'],
        'Read, write, execute — the three letters that keep a server safe from itself.',
        [
          code('bash', 'ls -l                    # -rw-r--r--  owner group  file\nchmod 755 deploy.sh     # owner rwx, group r-x, others r-x\nchown www-data app/     # change ownership'),
          p('Permissions string: one character for type, then three triplets — owner, group, others — each of r(read), w(write), x(execute). The classic trio of numbers: 4 read, 2 write, 1 execute, summed per group.'),
          p('Why it matters: your app runs as a low-privilege user, so a compromised script cannot rewrite the whole server. The web server reads the public folder; only deploy scripts need write+execute.'),
          msg('danger', 'A file chmod 777 (everyone: read+write+execute) is a written invitation. Ask "who needs access" and give exactly that.')
        ]
      ),
      lesson('Processes & Services', 4, 'Intermediate', 20, ['linux', 'processes'],
        'ps, top, kill — the art of noticing a hung worker and surgically removing it.',
        [
          code('bash', 'ps aux | grep php          # who is running PHP right now?\ntop                        # live view of load\nkill -TERM 1234            # graceful stop\ntail -f /var/log/nginx/error.log   # watch a log live'),
          p('A server is a balloon of processes. When something misbehaves — port in use, queue stuck, memory climbing — the process table and the logs tell you the truth quickly.'),
          msg('tip', 'You will meet systemctl next: `systemctl status nginx`, `systemctl restart php-fpm`. Think of it as process manager with auto-restart — housekeeping for services.')
        ]
      )
    ]
  );
})();