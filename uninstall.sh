#!/usr/bin/env bash
# ==============================================================================
# CloudPanel Neon Dark Edition - Clean Uninstaller
# Restores original CloudPanel configuration safely
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

THEME_DIR="/home/clp/custom-theme"
CLP_CONF="/home/clp/services/nginx/sites-enabled/cloudpanel.conf"
APT_HOOK="/etc/apt/apt.conf.d/99cloudpanel-theme"

echo -e "${YELLOW}${BOLD}"
echo "  ╔════════════════════════════════════════════════════════════╗"
echo "  ║         CloudPanel Neon Dark Edition - Uninstaller         ║"
echo "  ╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] This script must be run as root or with sudo.${NC}" 
   exit 1
fi

echo -e "${BLUE}[1/3] Removing Nginx injection block...${NC}"
if [ -f "${CLP_CONF}" ]; then
    sed -i '/# BEGIN CLOUDPANEL NEON DARK/,/# END CLOUDPANEL NEON DARK/d' "${CLP_CONF}"
    echo -e "${GREEN}✓ Removed injection directives from ${CLP_CONF}${NC}"
fi

echo -e "${BLUE}[2/3] Cleaning up theme directory and APT hook...${NC}"
rm -rf "${THEME_DIR}"
rm -f "${APT_HOOK}"
echo -e "${GREEN}✓ Removed theme files and update hook.${NC}"

echo -e "${BLUE}[3/3] Reloading Nginx...${NC}"
if systemctl is-active --quiet clp-nginx; then
    systemctl restart clp-nginx
    echo -e "${GREEN}✓ clp-nginx restarted.${NC}"
elif command -v nginx &>/dev/null; then
    nginx -t && nginx -s reload || true
    echo -e "${GREEN}✓ System Nginx reloaded.${NC}"
fi

echo -e "\n${GREEN}${BOLD}✓ CloudPanel restored to default original state successfully.${NC}\n"
