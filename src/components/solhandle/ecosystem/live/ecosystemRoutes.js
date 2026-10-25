export const ecosystemPaths = ['/', '/ecosystem', '/discover', '/search', '/profile', '/my-handles', '/contacts', '/pay', '/receive'];
export const isEcosystemPath = path => ecosystemPaths.includes(path) || path.startsWith('/discover/projects/');
export const ecosystemAssets = {
  logo: 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c9341a9b4_logo.png',
  city: 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png'
};