<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Hub - README</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0d1815 0%, #1a2f25 100%);
            color: #e2e8f0;
            line-height: 1.8;
            padding: 0;
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        /* Header Section */
        .header {
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%);
            border-radius: 24px;
            border: 2px solid rgba(250, 204, 21, 0.3);
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(250, 204, 21, 0.05) 0%, transparent 70%);
            animation: glow 3s ease-in-out infinite;
        }

        @keyframes glow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10%, 5%); }
        }

        .logo {
            position: relative;
            z-index: 1;
            margin-bottom: 20px;
        }

        .logo svg {
            animation: spin 20s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .title {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #facc15, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            z-index: 1;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 1.2rem;
            color: #93ab9e;
            position: relative;
            z-index: 1;
            font-weight: 500;
        }

        .badge-container {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
            position: relative;
            z-index: 1;
        }

        .badge {
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
            border: 1px solid;
        }

        .badge-pwa {
            background: rgba(74, 222, 128, 0.15);
            color: #4ade80;
            border-color: #4ade80;
        }

        .badge-offline {
            background: rgba(56, 189, 248, 0.15);
            color: #38bdf8;
            border-color: #38bdf8;
        }

        .badge-responsive {
            background: rgba(192, 132, 252, 0.15);
            color: #c084fc;
            border-color: #c084fc;
        }

        .badge-sinhala {
            background: rgba(251, 113, 133, 0.15);
            color: #fb7185;
            border-color: #fb7185;
        }

        /* Section Cards */
        .section {
            background: rgba(19, 32, 28, 0.8);
            border: 1px solid #25392f;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 24px;
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .section:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border-color: rgba(250, 204, 21, 0.3);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #facc15;
        }

        .section-title .icon {
            font-size: 1.8rem;
        }

        .section p {
            color: #93ab9e;
            margin-bottom: 12px;
        }

        /* Feature Grid */
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-top: 20px;
        }

        .feature-card {
            background: rgba(13, 24, 21, 0.8);
            border: 1px solid #25392f;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            border-color: #facc15;
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(250, 204, 21, 0.1);
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .feature-title {
            font-weight: 700;
            color: #f2f7ee;
            margin-bottom: 6px;
        }

        .feature-desc {
            font-size: 0.85rem;
            color: #93ab9e;
        }

        /* Code Block */
        .code-block {
            background: #0a1210;
            border: 1px solid #25392f;
            border-radius: 12px;
            padding: 20px;
            margin: 16px 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #4ade80;
            position: relative;
        }

        .code-block::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 30px;
            background: rgba(19, 32, 28, 0.5);
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            padding: 0 16px;
        }

        .code-block .dots {
            display: flex;
            gap: 6px;
            margin-bottom: 16px;
        }

        .code-block .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }

        .dot-red { background: #fb7185; }
        .dot-yellow { background: #facc15; }
        .dot-green { background: #4ade80; }

        .code-block code {
            display: block;
            margin-top: 10px;
        }

        .comment { color: #6b7280; }
        .string { color: #fbbf24; }
        .keyword { color: #c084fc; }
        .function { color: #38bdf8; }

        /* Tech Stack */
        .tech-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }

        .tech-tag {
            padding: 4px 14px;
            border-radius: 50px;
            background: rgba(250, 204, 21, 0.1);
            color: #facc15;
            font-size: 0.85rem;
            font-weight: 500;
            border: 1px solid rgba(250, 204, 21, 0.2);
        }

        /* Lists */
        ul {
            list-style: none;
            padding-left: 0;
        }

        ul li {
            padding: 8px 0;
            color: #93ab9e;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        ul li::before {
            content: '✦';
            color: #facc15;
            font-size: 0.8rem;
            margin-top: 4px;
        }

        /* Table */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
        }

        th, td {
            padding: 12px 16px;
            text-align: left;
            border: 1px solid #25392f;
        }

        th {
            background: rgba(250, 204, 21, 0.1);
            color: #facc15;
            font-weight: 600;
        }

        td {
            color: #93ab9e;
        }

        /* Screenshot Placeholder */
        .screenshot-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 20px;
        }

        .screenshot {
            background: rgba(19, 32, 28, 0.6);
            border: 2px dashed #25392f;
            border-radius: 12px;
            padding: 40px 20px;
            text-align: center;
            color: #6b7280;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .screenshot:hover {
            border-color: #facc15;
            color: #facc15;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 40px 20px;
            margin-top: 40px;
            border-top: 1px solid #25392f;
        }

        .footer .dev-name {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #facc15, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .footer .social-links {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 16px;
        }

        .social-link {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(250, 204, 21, 0.1);
            border: 1px solid rgba(250, 204, 21, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: #facc15;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background: rgba(250, 204, 21, 0.2);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(250, 204, 21, 0.2);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .title {
                font-size: 2rem;
            }

            .section {
                padding: 20px;
            }

            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <div class="container">

        <!-- Header -->
        <div class="header">
            <div class="logo">
                <svg viewBox="0 0 40 40" width="64" height="64">
                    <circle cx="20" cy="20" r="3.4" fill="#fb923c"/>
                    <ellipse cx="20" cy="20" rx="17" ry="7" fill="none" stroke="#facc15" stroke-width="2.2"/>
                    <ellipse cx="20" cy="20" rx="17" ry="7" fill="none" stroke="#facc15" stroke-width="2.2" transform="rotate(60 20 20)"/>
                    <ellipse cx="20" cy="20" rx="17" ry="7" fill="none" stroke="#facc15" stroke-width="2.2" transform="rotate(120 20 20)"/>
                </svg>
            </div>
            <h1 class="title">Quiz Hub</h1>
            <p class="subtitle">Interactive Science Learning Platform for Sri Lankan Students</p>
            
            <div class="badge-container">
                <span class="badge badge-pwa">📱 PWA App</span>
                <span class="badge badge-offline">📡 Offline Ready</span>
                <span class="badge badge-responsive">💻 Responsive</span>
                <span class="badge badge-sinhala">🇱🇰 සිංහල</span>
            </div>
        </div>

        <!-- Description -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">📖</span> About Quiz Hub
            </h2>
            <p>
                <strong>Quiz Hub</strong> is a modern, interactive web application designed to help Sri Lankan students master science concepts through engaging quizzes, flashcards, and gamified learning experiences. Built as a Progressive Web App (PWA), it works seamlessly on any device and supports full offline functionality.
            </p>
            <p>
                The app features a beautiful dark-mode interface with 9 stunning themes, Sinhala language support, and a comprehensive learning ecosystem with achievements, leaderboards, and daily challenges.
            </p>
        </div>

        <!-- Features -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">✨</span> Key Features
            </h2>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">📚</div>
                    <div class="feature-title">Study Mode</div>
                    <div class="feature-desc">Learn at your own pace with detailed explanations for every answer</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎮</div>
                    <div class="feature-title">Game Mode</div>
                    <div class="feature-desc">Challenge yourself with lives, timer, and power-ups</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🃏</div>
                    <div class="feature-title">Flashcards</div>
                    <div class="feature-desc">Flip through interactive flashcards for quick revision</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏆</div>
                    <div class="feature-title">Leaderboard</div>
                    <div class="feature-desc">Compete with others and track your ranking</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏅</div>
                    <div class="feature-title">Achievements</div>
                    <div class="feature-desc">Unlock 10+ achievements as you progress</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📅</div>
                    <div class="feature-title">Daily Challenges</div>
                    <div class="feature-desc">Complete daily targets to earn bonus points</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <div class="feature-title">9 Beautiful Themes</div>
                    <div class="feature-desc">Dark, Light, Purple, Ocean, Forest, Sunset, Pink, Sakura & Pure White</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <div class="feature-title">PWA Support</div>
                    <div class="feature-desc">Install on any device and use offline</div>
                </div>
            </div>
        </div>

        <!-- Tech Stack -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">🛠️</span> Tech Stack
            </h2>
            <div class="tech-list">
                <span class="tech-tag">HTML5</span>
                <span class="tech-tag">CSS3</span>
                <span class="tech-tag">Vanilla JavaScript</span>
                <span class="tech-tag">PWA</span>
                <span class="tech-tag">Service Workers</span>
                <span class="tech-tag">Web Audio API</span>
                <span class="tech-tag">Local Storage</span>
                <span class="tech-tag">CSS Variables</span>
                <span class="tech-tag">CSS Grid</span>
                <span class="tech-tag">CSS Flexbox</span>
                <span class="tech-tag">Font Awesome</span>
                <span class="tech-tag">Google Fonts</span>
            </div>
        </div>

        <!-- Installation -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">🚀</span> Quick Start
            </h2>
            
            <h3 style="color: #f2f7ee; margin-bottom: 12px;">📥 Installation</h3>
            
            <div class="code-block">
                <div class="dots">
                    <span class="dot dot-red"></span>
                    <span class="dot dot-yellow"></span>
                    <span class="dot dot-green"></span>
                </div>
                <code>
                    <span class="comment"># Clone the repository</span><br>
                    <span class="keyword">git clone</span> <span class="string">https://github.com/DLALakshan/quiz-hub.git</span><br><br>
                    <span class="comment"># Navigate to project directory</span><br>
                    <span class="keyword">cd</span> quiz-hub<br><br>
                    <span class="comment"># Open in browser or serve locally</span><br>
                    <span class="function">python -m http.server</span> 8000<br>
                    <span class="comment"># Then open: http://localhost:8000</span>
                </code>
            </div>

            <h3 style="color: #f2f7ee; margin: 20px 0 12px;">📱 PWA Installation</h3>
            <ol style="color: #93ab9e; padding-left: 24px;">
                <li>Open the app in Chrome/Safari on your mobile device</li>
                <li>Tap the "Install" button or browser menu</li>
                <li>Select "Add to Home Screen"</li>
                <li>The app will install and work offline!</li>
            </ol>
        </div>

        <!-- Project Structure -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">📁</span> Project Structure
            </h2>
            
            <div class="code-block">
                <div class="dots">
                    <span class="dot dot-red"></span>
                    <span class="dot dot-yellow"></span>
                    <span class="dot dot-green"></span>
                </div>
                <code>
                    quiz-hub/<br>
                    ├── <span class="string">index.html</span>          <span class="comment"># Main application file</span><br>
                    ├── <span class="string">data.json</span>           <span class="comment"># Quiz questions & lessons</span><br>
                    ├── <span class="string">sw.js</span>               <span class="comment"># Service Worker for PWA</span><br>
                    ├── <span class="string">manifest.json</span>       <span class="comment"># PWA manifest</span><br>
                    ├── <span class="string">icon-192.png</span>        <span class="comment"># App icon (192x192)</span><br>
                    ├── <span class="string">icon-512.png</span>        <span class="comment"># App icon (512x512)</span><br>
                    └── <span class="string">README.md</span>           <span class="comment"># Documentation</span>
                </code>
            </div>
        </div>

        <!-- Modes -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">🎯</span> Learning Modes
            </h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Mode</th>
                        <th>Description</th>
                        <th>Features</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>📚 Study</td>
                        <td>Learn at your own pace</td>
                        <td>Detailed explanations, Hints, No time pressure</td>
                    </tr>
                    <tr>
                        <td>🎮 Game</td>
                        <td>Challenge mode with stakes</td>
                        <td>3 Lives, 20s Timer, 50/50 & Skip power-ups</td>
                    </tr>
                    <tr>
                        <td>🃏 Flashcard</td>
                        <td>Quick revision cards</td>
                        <td>Flip animations, Difficulty indicators, Keyboard navigation</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Themes -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">🎨</span> Available Themes
            </h2>
            <p>Quiz Hub comes with 9 carefully crafted themes to suit your preference:</p>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🌙</div>
                    <div class="feature-title">Dark</div>
                    <div class="feature-desc">Default elegant dark theme</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">☀️</div>
                    <div class="feature-title">Light</div>
                    <div class="feature-desc">Warm paper-like theme</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💜</div>
                    <div class="feature-title">Purple</div>
                    <div class="feature-desc">Rich purple aesthetic</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌊</div>
                    <div class="feature-title">Ocean</div>
                    <div class="feature-desc">Deep blue ocean vibes</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌿</div>
                    <div class="feature-title">Forest</div>
                    <div class="feature-desc">Nature-inspired green</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌅</div>
                    <div class="feature-title">Sunset</div>
                    <div class="feature-desc">Warm sunset colors</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌺</div>
                    <div class="feature-title">Pink</div>
                    <div class="feature-desc">Vibrant pink theme</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌸</div>
                    <div class="feature-title">Sakura</div>
                    <div class="feature-desc">Soft cherry blossom</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚪</div>
                    <div class="feature-title">Pure White</div>
                    <div class="feature-desc">Clean minimal design</div>
                </div>
            </div>
        </div>

        <!-- Achievements -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">🏅</span> Achievements
            </h2>
            <p>Unlock 11 unique achievements as you learn:</p>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🌱</div>
                    <div class="feature-title">First Steps</div>
                    <div class="feature-desc">Complete your first quiz</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏆</div>
                    <div class="feature-title">Perfect Score</div>
                    <div class="feature-desc">Get 100% on any quiz</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔥</div>
                    <div class="feature-title">On Fire</div>
                    <div class="feature-desc">5 correct answers in a row</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-title">Unstoppable</div>
                    <div class="feature-desc">10 correct answers in a row</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👑</div>
                    <div class="feature-title">Quiz Master</div>
                    <div class="feature-desc">Answer 50 questions total</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💯</div>
                    <div class="feature-title">Century</div>
                    <div class="feature-desc">100 correct answers total</div>
                </div>
            </div>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">⌨️</span> Keyboard Shortcuts
            </h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><kbd style="background:#25392f;padding:2px 8px;border-radius:4px;">1-4</kbd></td>
                        <td>Select answer option</td>
                    </tr>
                    <tr>
                        <td><kbd style="background:#25392f;padding:2px 8px;border-radius:4px;">Enter</kbd></td>
                        <td>Confirm / Next question</td>
                    </tr>
                    <tr>
                        <td><kbd style="background:#25392f;padding:2px 8px;border-radius:4px;">← →</kbd></td>
                        <td>Navigate flashcards</td>
                    </tr>
                    <tr>
                        <td><kbd style="background:#25392f;padding:2px 8px;border-radius:4px;">Space</kbd></td>
                        <td>Flip flashcard</td>
                    </tr>
                    <tr>
                        <td><kbd style="background:#25392f;padding:2px 8px;border-radius:4px;">F</kbd></td>
                        <td>Toggle fullscreen</td>
                    </tr>
                    <tr>
                        <td><kbd style="background:#25392f;padding:2px 8px;border-radius:4px;">M</kbd></td>
                        <td>Mute / Unmute sounds</td>
                    </tr>
                    <tr>
                        <td><kbd style="background:#25392f;padding:2px 8px;border-radius:4px;">T</kbd></td>
                        <td>Cycle through themes</td>
                    </tr>
                    <tr>
                        <td><kbd style="background:#25392f;padding:2px 8px;border-radius:4px;">Esc</kbd></td>
                        <td>Close modals / Go back</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Browser Support -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">🌐</span> Browser Support
            </h2>
            <p>Quiz Hub works on all modern browsers:</p>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🦊</div>
                    <div class="feature-title">Chrome</div>
                    <div class="feature-desc">Full PWA support</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🧭</div>
                    <div class="feature-title">Safari</div>
                    <div class="feature-desc">iOS & macOS support</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌐</div>
                    <div class="feature-title">Edge</div>
                    <div class="feature-desc">Full PWA support</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🦊</div>
                    <div class="feature-title">Firefox</div>
                    <div class="feature-desc">All features work</div>
                </div>
            </div>
        </div>

        <!-- Screenshots -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">📸</span> Screenshots
            </h2>
            <div class="screenshot-grid">
                <div class="screenshot">
                    <div style="font-size:3rem;">🏠</div>
                    <div>Home Screen</div>
                </div>
                <div class="screenshot">
                    <div style="font-size:3rem;">📝</div>
                    <div>Quiz Interface</div>
                </div>
                <div class="screenshot">
                    <div style="font-size:3rem;">🃏</div>
                    <div>Flashcard Mode</div>
                </div>
                <div class="screenshot">
                    <div style="font-size:3rem;">📊</div>
                    <div>Results Page</div>
                </div>
            </div>
            <p style="margin-top:12px; text-align:center; color:#6b7280;">
                📷 <em>Screenshots coming soon! Replace these placeholders with actual screenshots.</em>
            </p>
        </div>

        <!-- Contributing -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">🤝</span> Contributing
            </h2>
            <p>Contributions are welcome! Here's how you can help:</p>
            <ul>
                <li>🐛 Report bugs by opening an issue</li>
                <li>💡 Suggest new features or improvements</li>
                <li>📝 Add more quiz questions to data.json</li>
                <li>🎨 Create new themes or UI improvements</li>
                <li>📚 Improve documentation</li>
            </ul>
            
            <div class="code-block" style="margin-top:20px;">
                <div class="dots">
                    <span class="dot dot-red"></span>
                    <span class="dot dot-yellow"></span>
                    <span class="dot dot-green"></span>
                </div>
                <code>
                    <span class="comment"># Fork the repository</span><br>
                    <span class="keyword">git checkout</span> -b feature/amazing-feature<br>
                    <span class="comment"># Make your changes</span><br>
                    <span class="keyword">git commit</span> -m <span class="string">"Add amazing feature"</span><br>
                    <span class="keyword">git push</span> origin feature/amazing-feature<br>
                    <span class="comment"># Open a Pull Request</span>
                </code>
            </div>
        </div>

        <!-- License -->
        <div class="section">
            <h2 class="section-title">
                <span class="icon">📄</span> License
            </h2>
            <p>
                This project is licensed under the <strong style="color:#facc15;">MIT License</strong> - see the LICENSE file for details.
            </p>
            <p style="color:#6b7280;">
                Feel free to use, modify, and distribute this project for educational purposes.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div style="margin-bottom: 20px;">
                <svg viewBox="0 0 40 40" width="48" height="48">
                    <circle cx="20" cy="20" r="3.4" fill="#fb923c"/>
                    <ellipse cx="20" cy="20" rx="17" ry="7" fill="none" stroke="#facc15" stroke-width="2.2"/>
                    <ellipse cx="20" cy="20" rx="17" ry="7" fill="none" stroke="#facc15" stroke-width="2.2" transform="rotate(60 20 20)"/>
                    <ellipse cx="20" cy="20" rx="17" ry="7" fill="none" stroke="#facc15" stroke-width="2.2" transform="rotate(120 20 20)"/>
                </svg>
            </div>
            
            <h2 class="dev-name">Developed by Lakshan Dulip</h2>
            <p style="color:#93ab9e; margin-top: 8px;">
                🦊 Full Stack Developer & UI/UX Designer
            </p>
            
            <div class="social-links">
                <a href="https://github.com/DLALakshan" class="social-link" title="GitHub">
                    <i class="fab fa-github"></i>🐙
                </a>
                <a href="#" class="social-link" title="LinkedIn">
                    <i class="fab fa-linkedin"></i>💼
                </a>
                <a href="#" class="social-link" title="Portfolio">
                    <i class="fas fa-globe"></i>🌐
                </a>
                <a href="#" class="social-link" title="Email">
                    <i class="fas fa-envelope"></i>✉️
                </a>
            </div>
            
            <p style="color:#6b7280; margin-top: 20px; font-size: 0.85rem;">
                © 2024 Quiz Hub. All rights reserved.<br>
                Made with ❤️ in Sri Lanka 🇱🇰
            </p>
        </div>

    </div>

</body>
</html>
