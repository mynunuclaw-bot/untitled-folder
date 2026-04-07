import os
import glob

# For root HTML files
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace the text logo div with the new image logo
    new_content = content.replace('<div class="logo-icon">V</div>', '<img class="logo-img" src="assets/images/logo.PNG" alt="Visual Illusion" style="height: 44px; border-radius: 8px; object-fit: contain; max-width: 150px;">')
    
    with open(file, 'w') as f:
        f.write(new_content)

# For admin index.html
admin_file = 'admin/index.html'
if os.path.exists(admin_file):
    with open(admin_file, 'r') as f:
        admin_content = f.read()
    
    # Sidebar logo
    admin_content = admin_content.replace('<div class="brand-icon">V</div>', '<img src="../assets/images/logo.PNG" alt="Visual Illusion" style="height: 32px; border-radius: 6px; object-fit: contain;">')
    
    # Login overlay logo
    admin_content = admin_content.replace('<div class="brand-icon" style="margin: 0 auto 16px; width: 48px; height: 48px; font-size: 24px; line-height: 48px;">V</div>', '<img src="../assets/images/logo.PNG" alt="Visual Illusion" style="margin: 0 auto 16px; height: 64px; border-radius: 12px; object-fit: contain; display: block;">')
    
    with open(admin_file, 'w') as f:
        f.write(admin_content)

print("Logos replaced successfully.")
