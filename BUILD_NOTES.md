# Verification for this archive

- npm installation completed and package-lock.json is included.
- TypeScript check (tsc --noEmit) passed.
- CI=true npm run build completed with "Compiled successfully" after fixing
  image alt handling and explicit authorization-expression parentheses.
- Production JS: approximately 92.95 kB gzip; CSS: approximately 9 kB gzip.
- No generated mock tests or automated test suite are included.
- Browser screenshot verification was attempted, but the environment's Chromium
  process could not launch (SIGABRT / ptrace restriction). Desktop/mobile visual
  rendering therefore remains unverified in this environment.
- Real backend domain integration was not run; only its authentication adapter
  is implemented. Build success is not proof of production booking correctness.

Dependencies and source are included; node_modules and build are excluded from
this source archive. npm ci recreates dependencies using the included lockfile.
