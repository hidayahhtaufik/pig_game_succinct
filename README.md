# 🎲 Succinct Pig Game - Zero-Knowledge Gaming

A modern implementation of the classic Pig dice game with **Succinct SP1 Zero-Knowledge Proofs** for verifying game winners.

## 🌟 Features

- 🎮 **Interactive Pig Game** - Modern web-based dice game
- 🔮 **SP1 Zero-Knowledge Proofs** - winner verification
- 📱 **Responsive Design** - Works on desktop and mobile
- 🐦 **Twitter Integration** - Share your verified wins

## 🎯 Game Rules

1. Players take turns rolling a dice
2. Accumulate points during your turn
3. **Hold** to bank your current score 
4. **Rolling 1** loses your current score and switches players
5. **First to 100 points wins** and gets an SP1 proof!

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Rust** with Succinct toolchain

### Installation

```bash
# Clone repository
git clone https://github.com/hidayahhtaufik/pig_game_succinct.git
cd pig_game_succinct

# Install Node.js dependencies
npm install

# Install SP1 toolchain
curl -L https://sp1up.succinct.xyz | bash
source ~/.bashrc
sp1up

# Build SP1 proof system
cd pig-game-proof/script
rustup override set succinct
cargo build --release

# Start the server
cd ../..
node server.js
```

### Access the Game

- **🎲 Play Game**: `http://localhost:3000`
- **🔮 Proof Explorer**: `http://localhost:3000/proofs`

## 🔮 SP1 Proof Commands

### Generate Proof

```bash
cd pig-game-proof/script

# Generate proof for winner
cargo run --bin pig_game_prove --release -- --prove --player "Player 1"
```

### Verify Proof

```bash
# Verify generated proof
cargo run --bin pig_game_prove --release -- --verify --proof-path succinct_pig_game_proof_player_1.bin
```

## 🚀 Production Deployment

### VPS Deployment (Ubuntu 22.04)

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment (replace with your domain)
./deploy.sh yourdomain.com
```

The deployment script will automatically:
- Install Node.js, Rust, and SP1
- Build the SP1 proof system
- Setup Nginx reverse proxy
- Configure SSL with Let's Encrypt
- Start the application with PM2

### Manual Deployment

```bash
# Install dependencies
npm install

# Build SP1 system
cd pig-game-proof/script
rustup override set succinct
cargo build --release

# Start with PM2
cd ../..
pm2 start ecosystem.config.js
```

## 🏗️ Project Structure

```
pig_game_succinct/
├── 📄 index.html          # Main game interface
├── 🎨 style.css           # Game styling  
├── ⚡ script.js           # Game logic & SP1 integration
├── 🖥️  server.js           # Backend API server
├── 🔮 proofs.html         # Proof explorer
├── 📦 package.json        # Dependencies
└── 🦀 pig-game-proof/     # SP1 Rust project
    ├── 📁 program/        # SP1 zkVM program
    └── 📁 script/         # Proof generation tool
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build SP1 proofs
npm run build-sp1

# View logs
npm run logs
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **[Succinct Labs](https://succinct.xyz)** - SP1 Zero-Knowledge Virtual Machine
- **[SP1 Documentation](https://docs.succinct.xyz)** - Comprehensive ZK guides

## 📞 Contact

- 📧 **Email**: hidayahhtaufik12@gmail.com
- 🐦 **Twitter**: [@hidayahhtaufik](https://twitter.com/hidayahhtaufik)
- 🐙 **GitHub**: [hidayahhtaufik](https://github.com/hidayahhtaufik)

---

**Built with ❤️ using Succinct SP1 Zero-Knowledge Proofs**
        └── 📁 src/bin/
            └── 🔮 pig_game_prove.rs
```

## 🔮 SP1 Proof System

### Generate Proof

```bash
cd pig-game-proof/script

# Generate proof for winner
cargo run --bin pig_game_prove --release -- --prove --player "Player 1"
```

### Verify Proof

```bash
# Verify generated proof
cargo run --bin pig_game_prove --release -- --verify --proof-path succinct_pig_game_proof_player_1.bin
```

### Proof Features

- ✅ **Zero-Knowledge** - Winner verification without revealing game state
- ✅ **Secure** - Uses Succinct SP1 zkVM
- ✅ **Verifiable** - Independent proof validation
- ✅ **Downloadable** - Export proofs as `.bin` files

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main game interface |
| `/proofs` | GET | Proof explorer |
| `/api/generate-proof` | POST | Generate SP1 proof |
| `/api/proofs` | GET | List all proofs |
| `/api/proofs/download/:filename` | GET | Download proof file |
| `/api/status` | GET | System status |
| `/health` | GET | Health check |

### Generate Proof API

```bash
curl -X POST http://localhost:3000/api/generate-proof \
  -H "Content-Type: application/json" \
  -d '{"name": "Player 1"}'
```

## 🚀 Production Deployment

### VPS Deployment (Ubuntu 22.04)

1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
   source ~/.bashrc
   
   # Install SP1
   curl -L https://sp1up.succinct.xyz | bash
   source ~/.bashrc
   sp1up
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/succinct-pig-game.git
   cd succinct-pig-game
   
   # Install dependencies
   npm install
   
   # Build SP1 system
   cd pig-game-proof/script
   rustup override set succinct
   cargo build --release
   
   # Install PM2
   sudo npm install -g pm2
   
   # Start application
   cd ../..
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx**
   ```bash
   sudo apt install -y nginx
   
   # Configure reverse proxy
   sudo nano /etc/nginx/sites-available/succinct-pig-game
   ```

4. **SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Docker Deployment

```dockerfile
FROM node:20-alpine

# Install Rust and SP1
RUN apk add --no-cache curl build-base
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN source ~/.bashrc && curl -L https://sp1up.succinct.xyz | bash

WORKDIR /app
COPY . .

RUN npm install
RUN cd pig-game-proof/script && cargo build --release

EXPOSE 3000
CMD ["node", "server.js"]
```

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build SP1 proofs in development
cd pig-game-proof/script
cargo build
```

### Testing

```bash
# Test API endpoints
curl http://localhost:3000/health

# Test proof generation
cd pig-game-proof/script
./target/release/pig_game_prove --prove --player "Player 1"
./target/release/pig_game_prove --verify --proof-path succinct_pig_game_proof_player_1.bin
```

## 🛠️ Configuration

### Environment Variables

```bash
export NODE_ENV=production
export PORT=3000
export SP1_PROVER=cpu    
export RUST_LOG=info
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'succinct-pig-game',
    script: 'server.js',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

## 🐛 Troubleshooting

### Common Issues

1. **SP1 Binary Not Found**
   ```bash
   cd pig-game-proof/script
   cargo clean && cargo build --release
   ```

2. **CORS Errors**
   - Access game via `http://localhost:3000` (not file://)
   - Check server CORS configuration

3. **Proof Generation Timeout**
   - Increase timeout in server configuration  
   - Check system resources (SP1 is memory intensive)

4. **Rust Toolchain Issues**
   ```bash
   rustup toolchain list | grep succinct
   rustup override set succinct
   ```

## 📊 Performance

- **Proof Generation**: 15-30 seconds (depending on hardware)
- **Memory Usage**: ~2GB during proof generation
- **Storage**: ~40MB per proof file
- **Network**: Minimal bandwidth requirements

## 🔐 Security

- **Zero-Knowledge Proofs** - No sensitive data exposed
- **Input Validation** - All user inputs sanitized
- **Rate Limiting** - API endpoints protected
- **CORS Protection** - Cross-origin requests controlled
- **File Security** - Only `.bin` proof files accessible

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Succinct Labs](https://succinct.xyz)** - SP1 Zero-Knowledge Virtual Machine
- **[SP1 Documentation](https://docs.succinct.xyz)** - Comprehensive ZK guides
- **Pig Game** - Classic dice game rules

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/hidayahhtaufik/succinct-pig-game/issues)
- 📧 **Email**: hidayahhtaufik12@gmail.com
- 🐦 **Twitter**: [@hidayahhtaufik](https://twitter.com/hidayahhtaufik)

---

**Built with ❤️ using Succinct SP1 Zero-Knowledge Proofs**