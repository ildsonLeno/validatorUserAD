const fs = require('fs');
const path = require('path');

// Read package-lock.json
const packageLockPath = path.join(__dirname, 'package-lock.json');
const packageLock = require(packageLockPath);

// Update dependencies versions
if (packageLock.packages) {
  Object.keys(packageLock.packages).forEach(pkg => {
    if (packageLock.packages[pkg].dependencies) {
      if (packageLock.packages[pkg].dependencies.glob) {
        packageLock.packages[pkg].dependencies.glob = "^10.3.10";
      }
    }
  });
}

// Write updated package-lock.json
fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));