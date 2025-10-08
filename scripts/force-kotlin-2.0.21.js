const fs = require('fs');
const path = require('path');

try {
  const gradleProps = path.join(process.cwd(), 'android', 'gradle.properties');
  if (fs.existsSync(gradleProps)) {
    let txt = fs.readFileSync(gradleProps, 'utf8');
    if (!/kotlinVersion=/.test(txt)) {
      fs.appendFileSync(gradleProps, '\nkotlinVersion=2.0.21\n');
      console.log('[fix] kotlinVersion=2.0.21 appended to gradle.properties');
    } else {
      txt = txt.replace(/kotlinVersion=.*/g, 'kotlinVersion=2.0.21');
      fs.writeFileSync(gradleProps, txt);
      console.log('[fix] kotlinVersion updated to 2.0.21');
    }
  } else {
    console.warn('[warn] gradle.properties not found yet');
  }
} catch (e) {
  console.error('[error] kotlinVersion patch failed:', e);
}
