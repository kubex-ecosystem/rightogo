#!/usr/bin/env bash
# lib/validate.sh – Validação de dependências

check_dependencies() {
  for dep in "$@"; do
    if ! command -v "$dep" > /dev/null; then
      if ! dpkg -l --selected-only "$dep" | grep "$dep" -q >/dev/null; then
        log error "$dep is not installed." true
        if [[ -z "${_NON_INTERACTIVE:-}" ]]; then
          log warn "$dep is required for this script to run." true
          local answer=""
          if [[ -z "${_FORCE:-}" ]]; then
            log question "Would you like to install it now? (y/n)" true
            read -r -n 1 -t 10 answer || answer="n"
          elif [[ "${_FORCE:-n}" == [Yy] ]]; then
            log warn "Force mode is enabled. Installing $dep without confirmation."
            answer="y"
          fi
          if [[ $answer =~ ^[Yy]$ ]]; then
            sudo apt-get install -y "$dep" || {
              log error "Failed to install $dep. Please install it manually."
              return 1
            }
            log info "$dep has been installed successfully."
          fi
        else
          log warn "$dep is required for this script to run. Installing..." true
          if [[ "${_FORCE:-}" =~ ^[Yy]$ ]]; then
            log warn "Force mode is enabled. Installing $dep without confirmation."
            sudo apt-get install -y "$dep" || {
            log error "Failed to install $dep. Please install it manually."
              return 1
            }
            log info "$dep has been installed successfully."
          else
            log error "Failed to install $dep. Please install it manually before running this script."
            return 1
          fi
        fi
      fi
    fi
  done
}

export -f check_dependencies
