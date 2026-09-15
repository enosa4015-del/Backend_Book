/* ============================================================
   THE BACKEND DEVELOPER BOOK — content, part 3 (chapters 9–12)
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

  /* ============================================================
     CHAPTER 9 — DOCKER
     ============================================================ */
  ch(9, 'docker', 'Docker: Ship It Anywhere', 'docker',
    'The "works on my machine" problem, solved once: package your app and its whole world into containers that run identically on any Linux. Images, Dockerfiles, volumes and compose — enough to ship like a professional.',
    [
      lesson('What Is a Container?', 1, 'Beginner', 12, ['docker', 'concepts'],
        'A shipping container for code: your app, its runtime, its libraries — one sealed, repeatable unit.',
        [
          p('Your app depends on PHP version X, extension Y, nginx this, MySQL that. On your machine it works. On the server? "Sorry, the PHP version is different." The classic answer is an image: a snapshot of the whole environment — OS bits, runtime, dependencies — plus your code, sealed like a shipping container.'),
          p('You do not build a fresh environment at deploy time; you unpack an image and run a container from it. Identically, every time, on any machine with Docker.'),
          code('bash', 'docker run -d --name web -p 8080:80 nginx\n# download the nginx image, run a container from it,\n# publish host port 8080 -> container port 80'),
          msg('fun', '"Works on my machine" is solemnly regarded as the top problem in software deployment. Docker does not fix the phrase; it fixes the world in which the phrase is a problem.')
        ]
      ),
      lesson('Images & Dockerfiles', 2, 'Intermediate', 20, ['docker', 'images'],
        'FROM, RUN, COPY: your environment as a buildable recipe.',
        [
          code('dockerfile', 'FROM php:8.3-fpm\n\nRUN docker-php-ext-install pdo_mysql\n\nCOPY . /var/www/app\nWORKDIR /var/www/app\n\nCMD ["php-fpm"]'),
          code('bash', 'docker build -t my-app .\ndocker run -p 9000:80 my-app'),
          p('A Dockerfile is a recipe: start from a base image (FROM), install what it needs (RUN), copy your code in (COPY). The image is the baked cake; a container is a serving being eaten. Build once, run anywhere.'),
          msg('tip', 'Base image = foundation. Use official images (php:8.3-fpm, nginx) rather than random community ones. Official images hold the trust in the supply chain.')
        ]
      ),
      lesson('Volumes, Ports & Networking', 3, 'Intermediate', 20, ['docker', 'volumes'],
        'Containers are ephemeral. Volumes make state survive; published ports and networks connect things safely.',
        [
          code('bash', '# survive restarts: map a host folder into the container\ndocker run -d -v $(pwd):/var/www/app my-app\n\n# expose a port: host:container\ndocker run -d -p 8080:80 nginx\n\n# peers talk on a shared network, no -p needed\ndocker network create mynet\ndocker network connect mynet db'),
          p('Container files are wiped with the container. Anything that must outlive it — uploads, database data — lives in a volume. Ports are doors; a private network is a corridor only your containers use.'),
          msg('warning', 'In production, do not mount your whole code folder as a volume. That is a dev trick for live reload. Ship the image; the server runs the image.')
        ]
      ),
      lesson('Docker Compose', 4, 'Intermediate', 20, ['docker', 'compose'],
        'One file that starts the whole orchestra: app, database, cache — with proper links between them.',
        [
          code('yaml', 'services:\n  app:\n    build: .\n    ports:\n      - "8080:80"\n    depends_on:\n      - db\n\n  db:\n    image: mysql:8.4\n    environment:\n      MYSQL_ROOT_PASSWORD: secret\n      MYSQL_DATABASE: myapp\n    volumes:\n      - db_data:/var/lib/mysql\n\nvolumes:\n  db_data:'),
          code('bash', 'docker compose up -d      # start the whole stack\ndocker compose down        # stop it\ndocker compose logs -f app # follow app logs'),
          quiz('In compose, depends_on guarantees the database:', ['starts before the app', 'receives the app\u2019s secrets', 'serves static files'], 0, 'depends_on orders startup so the database is up before the app connects. Apps reach it by service name on the shared network.'),
          p('compose up builds and starts everything with one command. The app connects to the database via the service name "db" — Docker\u2019s DNS provides the address for free. Local dev becomes: one file, one command, reproducible on any laptop.'),
          msg('tip', 'Stop fighting about "but it works on my machine". Send a compose file; the argument ends within minutes.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 10 — DEPLOYMENT
     ============================================================ */
  ch(10, 'deploy', 'Deployment: Going Live', 'deployment',
    'From localhost to the world: SSH into a server, set up nginx and PHP-FPM, point a domain, encrypt with TLS, deploy your Laravel app, and sleep. This is where backend developers earn their keep.',
    [
      lesson('What "Going Live" Means', 1, 'Beginner', 10, ['deploy', 'concepts'],
        'Localhost vs. production: the checklist every deploy must pass.',
        [
          list([
            'A server somewhere with a public IP (a VPS from any major cloud, or a managed platform).',
            'A user account for you and a locked-down one for your app.',
            'A copy of your app, its dependencies and its environment variables.',
            'nginx (or Apache) serving your app; PHP-FPM running your PHP.',
            'A domain pointing at the server, terminated with HTTPS.',
            'Logs monitored, backups scheduled, restarts rehearsed.'
          ]),
          p('A "deploy" is the act of moving a working app from your machine into that permanent home. It fails most often not because of code but because of the ten things above being half-configured. This chapter builds them one at a time.'),
          msg('info', 'You can skip servers entirely with a platform (deploy from git, get a URL). Serving that way is valid — the fastest path to a live project. Then learn servers — both roads are legitimate.')
        ]
      ),
      lesson('SSH: The Backdoor Key', 2, 'Intermediate', 20, ['deploy', 'ssh'],
        'Connect to your server like you own it, because now you do.',
        [
          code('bash', '# generate a key pair ONCE on your machine\nssh-keygen -t ed25519 -C "you@example.com"\n\n# copy the public key to the server\nssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@your-server-ip\n\nssh deploy@your-server-ip   # welcome home'),
          p('SSH gives you a shell on the remote machine. Passphrase-protected keys plus public-key auth means passwords never travel the network. Generate the key once, copy the public half to the server, and log in from then on.'),
          msg('danger', 'Never deploy as root. Make a deploy user with sudo, disable root SSH login and password auth in /etc/ssh/sshd_config, then reload sshd. Small habit that blocks a whole class of attacks.')
        ]
      ),
      lesson('nginx + PHP-FPM', 3, 'Intermediate', 25, ['deploy', 'nginx'],
        'The two-piece engine of almost every PHP server: nginx for HTTP, PHP-FPM for running the code.',
        [
          code('bash', 'sudo apt install nginx php-fpm'),
          code('nginx', 'server {\n    listen 80;\n    server_name example.com;\n    root /var/www/app/public;\n\n    index index.php;\n\n    location / {\n        try_files $uri $uri/ /index.php?$query_string;\n    }\n\n    location ~ \\.php$ {\n        include snippets/fastcgi-php.conf;\n        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;\n    }\n}'),
          quiz('In the nginx site config, root should point at:', ['the Laravel app root', 'the Laravel public/ folder', 'the storage folder'], 1, 'Only public/ must be web-accessible. Pointing at the app root exposes .env and config to anyone.'),
          p('nginx is fast and quiet at serving static files and proxying. Requests for /index.php go to PHP-FPM — the PHP process manager — which runs your code and returns HTML. The try_files line is the famous "front controller": unknown paths fall through to index.php and Laravel takes it from there.'),
          msg('warning', 'If you see a download prompt instead of HTML, nginx is serving the PHP file as a file — the fastcgi_pass is misconfigured. Check the socket path; the error log will confirm.')
        ]
      ),
      lesson('Domains, DNS & TLS', 4, 'Intermediate', 20, ['deploy', 'https'],
        'Give your server a name and prove it with a certificate — HTTPS is not optional.',
        [
          code('bash', '# DNS: an A record  example.com -> your-server-ip\n#                    and www.example.com -> same IP\n\n# free, automated HTTPS\nsudo apt install certbot python3-certbot-nginx\nsudo certbot --nginx -d example.com -d www.example.com'),
          p('A domain is a name for an IP. DNS points the name at your server. TLS (the modern half of HTTPS, once SSL) is cryptographic proof that the server answering for example.com is really yours — and it encrypts every byte in flight.'),
          p('Certbot reads your nginx config, issues a certificate, and wires the redirect to HTTPS. After that, HTTP requests bounce to HTTPS automatically.'),
          msg('danger', 'Never run a login form without HTTPS. Without it, passwords travel the network in cleartext. With Let\u2019s Encrypt there is no excuse left.')
        ]
      ),
      lesson('Deploying Laravel', 5, 'Intermediate', 30, ['deploy', 'laravel'],
        'The full ritual: pull code, install, build the .env, migrate, and make your server survive its first reboot.',
        [
          code('bash', 'cd /var/www/app\n\ngit pull origin main\ncomposer install --no-dev --optimize-autoloader\ncp .env.production .env && php artisan key:generate\n\nphp artisan migrate --force\nphp artisan config:cache && php artisan route:cache && php artisan view:cache\n\nsudo chown -R www-data:www-data storage bootstrap/cache\n\nsudo systemctl restart php8.3-fpm\nsudo systemctl reload nginx'),
          p('Note the pattern: fetch code -> install deps without dev -> set environment -> run migrations -> cache for speed -> fix permissions -> restart services. The .env lives on the server only; git never sees it.'),
          msg('danger', 'The storage/ and bootstrap/cache/ folders must be writable by the web server user and nothing else. Forgiving permissions is how deployments quietly break on the first user upload.')
        ]
      ),
      lesson('Environment Variables', 6, 'Intermediate', 15, ['deploy', 'env'],
        'The config your code must never contain: secrets live in the environment, not in the repository.',
        [
          code('env', 'APP_ENV=production\nAPP_DEBUG=false\nAPP_KEY=base64:xxxxxxxx...\n\nDB_HOST=127.0.0.1\nDB_DATABASE=myapp\nDB_USERNAME=myapp\nDB_PASSWORD=********\n\nMAIL_HOST=smtp.example.com\nMAIL_USERNAME=you@example.com'),
          quiz('In production, APP_DEBUG should be:', ['true', 'false'], 1, 'Debug mode reveals stack traces and internals. Keep it false in production.'),
          p('Every secret — database password, mail credentials, API keys — is an environment variable. Code reads them for you (env() in Laravel\u2019s config files), and values change per environment without touching code.'),
          msg('danger', 'APP_DEBUG=false in production, always. Debug mode prints stack traces and, with an APP_KEY leak, lets someone decrypt session data. The two-line checklist: DEBUG false, KEY generated and rotated.')
        ]
      ),
      lesson('Logs & Monitoring', 7, 'Intermediate', 15, ['deploy', 'ops'],
        'The server will eventually apologize to you in writing. Learn to read the apology: systemd, nginx, PHP and app logs.',
        [
          code('bash', 'sudo journalctl -u php8.3-fpm --since "1 hour ago"   # service logs\nsudo tail -f /var/log/nginx/error.log                 # nginx errors\nsudo tail -f /var/log/nginx/access.log                # who visited\ntail -f storage/logs/laravel.log                       # your app\u2019s log'),
          p('Logs are the diary of progress and mishap. When users say "it\u2019s broken", the logs say precisely which request failed, exactly when and with which exception. Reading the right log first turns debugging from archaeology into reading.'),
          msg('tip', 'Automate the ritual early: a cron job that uploads backups off-box and a basic uptime check that emails you when the site is down. Cheap insurance, huge confidence.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 11 — SIX REAL PROJECTS
     ============================================================ */
  ch(11, 'projects', 'Six Real Projects', 'projects',
    'Everything so far was a tool. Now build the resume: six projects ordered by difficulty, each one deploying something real. By the end you have shipped six things strangers can open.',
    [
      lesson('Project 1: Terminal Todo', 1, 'Beginner', 45, ['project', 'cli'],
        'A todo list that runs in the terminal — your first complete program, start to ship.',
        [
          p('Your first full program. A CLI todo app in plain PHP: add tasks, list them, mark them done, delete them. Store tasks in a simple JSON file so they survive restarts.'),
          code('php', '// storage/tasks.json     [{"id":1,"text":"learn PHP","done":false}]\n\n$tasks = json_decode(file_get_contents(\'storage/tasks.json\'), true);\n\n$command = $argv[1] ?? \'list\';\nswitch ($command) {\n    case \'add\':\n        $tasks[] = [\'id\' => count($tasks) + 1, \'text\' => $argv[2], \'done\' => false];\n        break;\n    case \'done\':\n        foreach ($tasks as &$t) { if ($t[\'id\'] == $argv[2]) $t[\'done\'] = true; }\n        break;\n}\n\nfile_put_contents(\'storage/tasks.json\', json_encode($tasks, JSON_PRETTY_PRINT));'),
          msg('tip', 'Do the project without copying full blocks from tutorials. Your hands know the syntax by now — trust them. The struggle of writing the JSON logic is the lesson.')
        ]
      ),
      lesson('Project 2: Personal Blog', 2, 'Beginner', 60, ['project', 'php'],
        'PHP + SQL: a tiny blog with posts, one admin page, and zero frameworks.',
        [
          p('A plain PHP + MySQL blog: posts stored in a table, listed on the homepage, readable individually, and an admin page protected by a password to write and delete. Build it with PDO prepared statements — the anti-injection habit from Chapter 4, exercised on purpose.'),
          code('php', '$pdo = new PDO(\'mysql:host=localhost;dbname=blog\', \'root\', \'\');\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n\n$posts = $pdo->query(\'SELECT id, title, created_at FROM posts ORDER BY created_at DESC\')->fetchAll(PDO::FETCH_ASSOC);\n\nforeach ($posts as $post) {\n    echo "<h2><a href=\'post.php?id={$post[\'id\']}\'>{$post[\'title\']}</a></h2>";\n    echo "<time>{$post[\'created_at\']}</time>";\n}'),
          msg('info', 'This is the exact shape of 80% of real web apps: data in, data out, a small admin gate. Master this and frameworks stop looking magical.')
        ]
      ),
      lesson('Project 3: URL Shortener', 3, 'Intermediate', 75, ['project', 'php'],
        'Turn long links into /abc — and the shock of realizing how much real product is hiding in one feature.',
        [
          p('Take a URL, hash or random-code it, store the pair, and redirect /code to the original. Count clicks per short URL and show the stats table. Suddenly you have user tracking, rate limiting questions and a caching problem — a real product in embryo.'),
          code('php', 'function shortcode(): string {\n    return substr(bin2hex(random_bytes(4)), 0, 6);\n}\n\n$code = shortcode();\n$stmt = $pdo->prepare(\'INSERT INTO links (code, url) VALUES (?, ?)\');\n$stmt->execute([$code, $url]);\n\n// redirect on visit\nheader(\'Location: \' . $original, true, 302);'),
          quiz('Why random_bytes for short codes instead of sequential ids?', ['They are shorter to type', 'Random unguessable codes stop people reaching other links by guessing', 'They sort faster'], 1, 'Sequential ids are guessable — codes must be unguessable.'),
          msg('tip', 'Keep the random codes collision-resistant (random_bytes) instead of id-based guessable codes. Short and unguessable is the whole brief.')
        ]
      ),
      lesson('Project 4: Blog in Laravel', 4, 'Intermediate', 90, ['project', 'laravel'],
        'Rebuild Project 2 with Laravel — and notice how the framework quietly vanishes from your mind.',
        [
          p('Now the framework edition: migration for posts, Eloquent routes, Blade views, validation, and auth via Breeze so only logged-in users can publish. Same product, but the plumbing is a framework\u2019s job now — your mental energy goes to features.'),
          code('php', 'class PostController extends Controller\n{\n    public function index()\n    {\n        $posts = Post::with(\'user\')->latest()->paginate(10);\n        return view(\'posts.index\', compact(\'posts\'));\n    }\n\n    public function store(Request $request)\n    {\n        $data = $request->validate([\'title\' => \'required\', \'body\' => \'required\']);\n        auth()->user()->posts()->create($data);\n        return redirect()->route(\'posts.index\');\n    }\n}'),
          msg('warning', 'You will be tempted to copy-paste the docs\u2019 examples whole. Type them. Laravel is learned by typing, the same as PHP was.')
        ]
      ),
      lesson('Project 5: REST API', 5, 'Advanced', 90, ['project', 'api'],
        'A JSON API for your posts: Sanctum auth, resources, pagination — and a frontend or Postman that calls it.',
        [
          p('Expose your Laravel posts as a real REST API: token auth via Sanctum, PostResource shape, pagination, validation on input. Then write a tiny client — HTML+JS fetch, or Postman — that logs in, reads, and creates posts through the API.'),
          code('js', 'const res = await fetch("/api/posts", {\n  method: "POST",\n  headers: { "Content-Type": "application/json",\n             "Authorization": "Bearer " + token },\n  body: JSON.stringify({ title: title, body: body })\n});\nconst created = await res.json();'),
          msg('tip', 'A JSON API you wrote AND consumed is the single best proof you understand the backend. It demonstrates every chapter of this book in one project.')
        ]
      ),
      lesson('Project 6: Ship Something Public', 6, 'Advanced', 120, ['project', 'deploy'],
        'Put ANY of the above on a real server with a domain and HTTPS. This project is the resume.',
        [
          p('Pick your best project — the Laravel blog or the API — and deploy it for real: VPS or managed platform, domain, TLS, backups. The URL you get is worth more in an interview than ten certificates.'),
          code('bash', '# after the deploy: the proof checklist\ncurl -I https://your-site.com     # 200, redirect to https\n# write your first post through the deployed app\n# break it. Fix it. Watch the log. Feel alive.'),
          msg('info', 'A deployed project is the difference between "I followed a course" and "I built this, you can visit it". Recruiters can sense that difference in one click.')
        ]
      )
    ]
  );

  /* ============================================================
     CHAPTER 12 — JOB READY
     ============================================================ */
  ch(12, 'job', 'Job Ready', 'career',
    'The craft is learned; now the role. A five-part survival kit: finish the training, refine the resume to results, curate the portfolio, speak interview, and keep shipping after the offer.',
    [
      lesson('Finish the Training', 1, 'Beginner', 10, ['career', 'training'],
        'Before the interview, the final mile of the plan — honest, quiet, complete.',
        [
          p('Before you start applying, close the loop on the fundamentals you skimmed: re-read this book\u2019s harder chapters (SQL, Laravel, Docker) with the "could I whiteboard the lesson" test. A candidate can be briefly unsure about anything; the silence is what worries interviewers.'),
          msg('tip', 'Set a date. "I will apply for junior backend roles by <month>" — a deadline converts a hobby into a job search overnight.')
        ]
      ),
      lesson('The Resume Rule', 2, 'Beginner', 15, ['career', 'resume'],
        'Hiring managers scan for seven seconds. The rule: results, not responsibilities.',
        [
          p('Say "what my work achieved", not "what I was responsible for". Numbers and concrete outcomes survive the six-second scan; verbs do not.'),
          list([
            'Before: "Responsible for creating a blog with Laravel."',
            'After: "Built a blog in Laravel with auth, validation, comments and a deployed HTTPS URL visited by users; designed and implemented the REST API consumed by the frontend."'
          ]),
          quiz('The resume rule, in one line:', ['list every technology you touched', 'results, not responsibilities', 'make it as long as it takes'], 1, 'Managers scan quickly. Concrete outcomes and artifacts survive; responsibility lists do not.'),
          msg('tip', 'Rewrite one bullet of your resume from "what I did" into "what my work achieved" — with a quantity or an artifact attached. That rewrite is the whole craft of the resume.')
        ]
      ),
      lesson('The Portfolio', 3, 'Intermediate', 20, ['career', 'portfolio'],
        'Your projects are your best cover letter. Curate; do not dump. Link everything; let the work talk.',
        [
          list([
            'Three best projects, not ten mediocre ones. Depth over breadth.',
            'Each with a URL people can open, a repo people can read, and 2\u20133 lines max.',
            'Lead with the deployed link. The code links second.'
          ]),
          p('The purpose of a portfolio is not to show effort; it is to make the reviewer confident of your proficiency in three minutes. A good resume is a landing page for a human being. If a URL proves it, link it and let the work talk.'),
          msg('fun', 'Most portfolios are reverse chronological excuses. Yours should be forward chronological confidence: here is the latest, best thing, with the deploy URL on top.')
        ]
      ),
      lesson('The Interview', 4, 'Advanced', 30, ['career', 'interview'],
        'The backend interview is a conversation about code, not a quiz. Two drills that make you ready.',
        [
          p('You will be asked to think out loud about code: databases, HTTP, auth, deployment. Two drills beat any memorization setup:'),
          list([
            'The "explain it simply" drill: pick any chapter of this book and explain it as if to a smart non-programmer. You will find the gaps fast.',
            'The "whiteboard a feature" drill: design a small feature end-to-end — tables, models, routes, security checks — before anyone asks you to.'
          ]),
          quiz('You forget an exact function name mid-interview. Best move:', ['Stall and say nothing', 'Say how you would find it in the docs and show the reasoning', 'Invent an answer'], 1, 'An honest "I would look it up like this" reads as professional. Stalling and bluffing read otherwise.'),
          p('When stuck in an interview, say the honest middle sentence: "I don\u2019t remember the exact function, but I would find it in the docs like this." Said early, that reads as professional.'),
          quote('The interview is not a trap. It is a rehearsal you get to run until someone pays you. The practice interviews you can actually schedule are worth more than any book.')
        ]
      ),
      lesson('Keep Shipping', 5, 'Beginner', 10, ['career', 'habits'],
        'The job is not the finish line. The habit of monthly shipping is what makes the years compound.',
        [
          p('Hired or not, keep a "one small thing a month" rhythm: a new endpoint, an open-source fix, a project refactored. Not because anyone requires it, but because shipping is the skill this whole book trained — and the skill only grows while it ships.'),
          quote('The backend is not a destination. It is a direction. Keep pushing code into the world and the world keeps answering.'),
          msg('tip', 'Write the next page of your learning publicly: a short post about the one thing that confused you most and how you untangled it. Teaching is the highest-leverage review.')
        ]
      )
    ]
  );
})();