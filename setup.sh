set -e 

echo "🔧 Installing root dependencies..."
npm install

echo "🔧 Installing backend dependencies..."
cd api
npm install

echo "🐳 Building Docker containers (backend)..."
docker compose up -d

cd ..

echo "🔧 Installing frontend dependencies..."
cd frontend
npm install

cd ..

echo "✅ Setup complete!"