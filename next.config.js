/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removendo ou atualizando a opção swcMinify conforme a versão
  // Se você estiver usando Next.js 12+, pode manter swcMinify: true
  // Se estiver usando uma versão anterior, remova essa linha
  
  // Configurações adicionais para melhorar o Hot Reload
  webpack: (config, { isServer }) => {
    // Mantenha as configurações existentes e adicione o que for necessário
    return config;
  },
}

module.exports = nextConfig
