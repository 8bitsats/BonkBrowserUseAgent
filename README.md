BONK Browser Agent
Show Image
BONK Browser Agent is an AI-powered browser automation platform for Solana operations, focused on the BONK token ecosystem. It now includes two powerful browser automation systems: the original Browser-Use API and the new Stagehand + Browserbase integration for advanced AI-powered browsing.
🚀 Features

Dual Browser Automation Engines:

Bonki Agent: Classic browser automation using browser-use.com and Steel APIs
Stagehand AI: Advanced AI-powered browser automation with natural language control


Wallet Analysis: Scan wallets for token information, empty accounts, and optimization opportunities
Token Account Cleanup: Identify and close empty token accounts to recover SOL
BONK Token Operations: Automate burning, transferring, and analyzing BONK tokens
Token Creation: Launch new tokens on letsbonk.fun with AI assistance
Live Browser Automation: Watch and control agents in real-time as they perform tasks
Session Recording: Record and replay browser sessions for later analysis
Task History: Track and review all agent activities and results
Solana Integration: Seamless connection with Phantom, Solflare, and Backpack wallets

📋 Prerequisites

Node.js 18+ and npm
A Solana wallet (Phantom, Solflare, or Backpack)
API keys for one or more of the following services:

Browser Use - For traditional browser automation
Steel - For browser session management
Browserbase - For Stagehand AI browser automation
OpenAI OR Anthropic - For AI capabilities
FAL - For image generation (optional)



🔧 Installation
Clone the repository
bashgit clone https://github.com/yourusername/bonk-browser-agent.git
cd bonk-browser-agent
Backend Setup
bash# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file
cp .env.example .env

# Edit the .env file with your API keys
nano .env
Frontend Setup
bash# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Create a .env file
cp .env.example .env

# Edit the .env file if necessary
nano .env
⚙️ Configuration
Backend Environment Variables
The backend requires the following environment variables in the .env file:
PORT=4000
NODE_ENV=development
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Required API keys (at least one browser automation system needed)
BROWSER_USE_API_KEY=your_browser_use_api_key
STEEL_API_KEY=your_steel_api_key
BROWSERBASE_API_KEY=your_browserbase_api_key
BROWSERBASE_PROJECT_ID=your_browserbase_project_id

# Required for AI capabilities (at least one needed)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional API keys
FAL_API_KEY=your_fal_api_key
XAI_API_KEY=your_xai_api_key

# Optional Browserbase settings
BROWSERBASE_REGION=us-east-1
BROWSERBASE_KEEP_ALIVE=true
BROWSERBASE_RECORDING=true
Frontend Environment Variables
The frontend uses these environment variables:
REACT_APP_API_URL=http://localhost:4000
REACT_APP_RPC_URL=https://api.mainnet-beta.solana.com
🏃‍♀️ Running the Application
Start the Backend Server
bashcd backend
npm start
The server will start on port 4000 (or the port specified in your .env file).
Start the Frontend Development Server
bashcd frontend
npm start
The frontend development server will start, usually on port 3000. Your browser should open automatically to http://localhost:3000.
🧩 Project Structure
bonk-browser-agent/
├── frontend/               # React frontend application
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   │   ├── AgentSessionViewer.jsx         # Browser-Use session viewer
│   │   │   ├── BrowserbaseSessionViewer.jsx   # Browserbase session viewer
│   │   │   ├── ControlPanel.jsx               # Browser-Use control panel
│   │   │   ├── StagehandControlPanel.jsx      # Stagehand AI control panel
│   │   │   ├── StagehandAgentView.jsx         # Stagehand agent view
│   │   │   └── ...                            # Other components
│   │   ├── context/        # Context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS styles
│   │   ├── App.jsx         # Main application component
│   │   ├── index.js        # Entry point
│   │   └── character.json  # Bonki agent character definition
│   ├── package.json        # Frontend dependencies
│   └── .env                # Frontend environment variables
│
├── backend/                # Node.js backend server
│   ├── src/                # Source code
│   │   ├── routes/         # API routes
│   │   │   ├── tasks.js             # Browser-Use tasks routes
│   │   │   ├── steel.js             # Steel sessions routes
│   │   │   ├── solana.js            # Solana blockchain routes
│   │   │   └── browserbase.js       # Browserbase & Stagehand routes
│   │   ├── services/       # Service layer
│   │   │   ├── browserUseService.js # Browser-Use service
│   │   │   ├── steelService.js      # Steel service
│   │   │   ├── solanaService.js     # Solana service
│   │   │   └── browserbaseService.js # Browserbase & Stagehand service
│   │   └── utils/          # Utility functions
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env                # Backend environment variables
│
├── SETUP.md                # Detailed setup instructions
└── README.md               # Project documentation
📚 API Documentation
Backend API Endpoints
Browser-Use Tasks

POST /api/tasks - Create a new browser task
GET /api/tasks/:taskId - Get task details
GET /api/tasks/:taskId/status - Get task status
GET /api/tasks/:taskId/screenshots - Get task screenshots
PUT /api/tasks/:taskId/pause - Pause a task
PUT /api/tasks/:taskId/resume - Resume a paused task
PUT /api/tasks/:taskId/stop - Stop a task

Steel Sessions

POST /api/steel/sessions - Create a new browser session
GET /api/steel/sessions - Get all active sessions
GET /api/steel/sessions/:sessionId - Get a specific session
DELETE /api/steel/sessions/:sessionId - Release a session

Solana

GET /api/solana/balance/:walletAddress - Get SOL balance
GET /api/solana/tokens/:walletAddress - Get token accounts
GET /api/solana/empty-accounts/:walletAddress - Get empty token accounts
GET /api/solana/bonk/:walletAddress - Get BONK token balance

Browserbase & Stagehand

POST /api/browserbase/sessions - Create a new Browserbase session
GET /api/browserbase/sessions/:sessionId/debug - Get debug links for a session
GET /api/browserbase/sessions/:sessionId/recording - Get session recording
GET /api/browserbase/sessions/:sessionId/logs - Get session logs
DELETE /api/browserbase/sessions/:sessionId - Close a session
POST /api/browserbase/tasks - Execute a task with Stagehand AI

🖼️ Screenshots
Dashboard
Show Image
Bonki Agent
Show Image
Stagehand AI
Show Image
Wallet Overview
Show Image
🔐 Security Notes

Both browser agents operate in sandbox environments and require your wallet connection only to perform actions
You should only connect your wallet when you're ready to execute a transaction
Always review transactions before signing them
The application does not store your private keys or seed phrases
Only trusted domains are allowed by default (configurable in the agent settings)

🛠️ Advanced Configuration
Stagehand AI Options
You can configure Stagehand AI with several advanced options:

AI Model Selection: Choose between GPT-4o, GPT-4o-Mini, or Claude 3.5 Sonnet
Starting URL: Set a specific starting URL for the browser session
Viewport Size: Configure the browser viewport dimensions
Session Recording: Enable or disable session recording for later analysis

Solana Network
By default, the application connects to Solana mainnet-beta. To use devnet for testing:

Change REACT_APP_RPC_URL in frontend .env to https://api.devnet.solana.com
Change SOLANA_RPC_URL in backend .env to https://api.devnet.solana.com

🐛 Troubleshooting

Agent not starting: Check if all required API keys are correctly set in the backend .env file
Wallet connection issues: Make sure your wallet extension is installed and unlocked
Transaction errors: Check if you have enough SOL for transaction fees
Backend connection error: Verify that the backend server is running and accessible
Stagehand AI not working: Verify both Browserbase API key and either OpenAI or Anthropic API key are configured

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

🙏 Acknowledgments

Browser Use - For the browser automation API
Steel - For browser session management
Browserbase - For advanced browser automation
Stagehand - For AI-powered browsing
OpenAI - For AI capabilities
Anthropic - For AI capabilities
Solana - For the blockchain infrastructure
BONK Token - For inspiration and integration support
All open-source libraries used in this project

📬 Contact

Project Link: https://github.com/yourusername/bonk-browser-agent
Developer: your-email@example.com


Built with ❤️ for the BONK and Solana community