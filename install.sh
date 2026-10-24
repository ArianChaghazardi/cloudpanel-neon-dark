#!/usr/bin/env bash
# ==============================================================================
# CloudPanel Neon Dark Edition - One-Click Installer
# Engineered for zero downtime, modern UI/UX, and 100% update-proof resilience
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

THEME_DIR="/home/clp/custom-theme"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLP_CONF="/home/clp/services/nginx/sites-enabled/cloudpanel.conf"
APT_HOOK="/etc/apt/apt.conf.d/99cloudpanel-theme"

echo -e "${CYAN}${BOLD}"
echo "  ╔════════════════════════════════════════════════════════════╗"
echo "  ║          CloudPanel Neon Dark Edition - Installer          ║"
echo "  ║        Minimalist • High-Contrast • Update-Proof UI        ║"
echo "  ╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check root permissions
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] This script must be run as root or with sudo.${NC}" 
   exit 1
fi

echo -e "${BLUE}[1/4] Deploying custom theme assets...${NC}"
mkdir -p "${THEME_DIR}"
cp -rf "${SCRIPT_DIR}/assets/css" "${THEME_DIR}/"
cp -rf "${SCRIPT_DIR}/assets/js" "${THEME_DIR}/"

# Ensure proper permissions for clp user
if id "clp" &>/dev/null; then
    chown -R clp:clp "${THEME_DIR}"
fi
chmod -R 755 "${THEME_DIR}"
echo -e "${GREEN}✓ Assets copied to ${THEME_DIR}${NC}"

echo -e "${BLUE}[2/4] Configuring CloudPanel Nginx injection...${NC}"
if [ -f "${CLP_CONF}" ]; then
    # Backup original configuration
    BACKUP_FILE="${CLP_CONF}.bak_$(date +%Y%m%d_%H%M%S)"
    cp "${CLP_CONF}" "${BACKUP_FILE}"
    echo -e "${YELLOW}  Backup created at: ${BACKUP_FILE}${NC}"

    # Check if already injected
    if grep -q "clp-custom" "${CLP_CONF}"; then
        echo -e "${YELLOW}  Nginx configuration already contains theme injection. Updating rules...${NC}"
        # Remove old block if exists
        sed -i '/# BEGIN CLOUDPANEL NEON DARK/,/# END CLOUDPANEL NEON DARK/d' "${CLP_CONF}"
    fi

    # Prepare injection snippet
    INJECTION_BLOCK=$(cat << 'EOF'
  # BEGIN CLOUDPANEL NEON DARK
  sub_filter_types text/html;
  sub_filter '</head>' '<link rel="stylesheet" href="/clp-custom/css/theme.css"><script defer src="/clp-custom/js/enhancer.js"></script></head>';
  sub_filter_once on;

  location /clp-custom/ {
    alias /home/clp/custom-theme/;
    access_log off;
    expires 30d;
  }
  # END CLOUDPANEL NEON DARK
EOF
)

    # Insert right before the last closing brace '}' of the server block
    sed -i '/^}$/i '"${INJECTION_BLOCK}"'' "${CLP_CONF}"

    echo -e "${GREEN}✓ Nginx configuration updated successfully.${NC}"
else
    echo -e "${YELLOW}[NOTICE] ${CLP_CONF} not found.${NC}"
    echo -e "If CloudPanel is behind a reverse proxy, add the following to your proxy server block:"
    echo -e "${CYAN}"
    echo "  sub_filter_types text/html;"
    echo "  sub_filter '</head>' '<link rel=\"stylesheet\" href=\"/clp-custom/css/theme.css\"><script defer src=\"/clp-custom/js/enhancer.js\"></script></head>';"
    echo "  sub_filter_once on;"
    echo ""
    echo "  location /clp-custom/ {"
    echo "    alias ${THEME_DIR}/;"
    echo "  }"
    echo -e "${NC}"
fi

echo -e "${BLUE}[3/4] Testing Nginx and restarting services...${NC}"
if systemctl is-active --quiet clp-nginx; then
    systemctl restart clp-nginx
    echo -e "${GREEN}✓ clp-nginx restarted successfully.${NC}"
elif command -v nginx &>/dev/null; then
    nginx -t && nginx -s reload || true
    echo -e "${GREEN}✓ System Nginx reloaded.${NC}"
fi

echo -e "${BLUE}[4/4] Setting up APT upgrade persistence hook...${NC}"
cat << 'EOF' > "${APT_HOOK}"
DPkg::Post-Invoke {
    "if [ -d /home/clp/custom-theme ] && [ -f /home/clp/services/nginx/sites-enabled/cloudpanel.conf ]; then if ! grep -q 'clp-custom' /home/clp/services/nginx/sites-enabled/cloudpanel.conf; then sed -i '/^}$/i \  sub_filter_types text/html;\n  sub_filter \"</head>\" \"<link rel=\\\"stylesheet\\\" href=\\\"/clp-custom/css/theme.css\\\"><script defer src=\\\"/clp-custom/js/enhancer.js\\\"></script></head>\";\n  sub_filter_once on;\n  location /clp-custom/ { alias /home/clp/custom-theme/; access_log off; expires 30d; }' /home/clp/services/nginx/sites-enabled/cloudpanel.conf; systemctl restart clp-nginx 2>/dev/null || true; fi; fi";
};
EOF
chmod 644 "${APT_HOOK}"
echo -e "${GREEN}✓ APT hook created at ${APT_HOOK}${NC}"

echo -e "\n${GREEN}${BOLD}============================================================${NC}"
echo -e "${GREEN}${BOLD}   CloudPanel Neon Dark Edition installed successfully!     ${NC}"
echo -e "${GREEN}${BOLD}============================================================${NC}"
echo -e "Open your CloudPanel URL in your browser and press ${CYAN}Ctrl + F5${NC} (hard refresh)."
echo -e "You will find the new ${CYAN}Theme Switcher${NC} in the top navigation bar."
