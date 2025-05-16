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