import JSZip from 'jszip';
import { ANDROID_FILES } from '../data/androidFiles';

export async function downloadAndroidStudioZip(): Promise<void> {
  const zip = new JSZip();

  // Root project folder name
  const root = zip.folder('SrdGuideHelper');
  if (!root) return;

  // Add all files
  for (const file of ANDROID_FILES) {
    root.file(file.path, file.content);
  }

  // Also include gradlew wrapper scripts placeholder notes and gitignore
  root.file(
    '.gitignore',
    `*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
/.idea/navEditor.xml
/.idea/assetWizardSettings.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties
`
  );

  root.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  // Generate zip blob
  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger browser download
  const url = URL.createObjectURL(content);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'SrdGuideHelper-AndroidStudio.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
