#!/usr/bin/env bash
# lib/install_funcs.sh – Functions for installing binaries and managing paths

install_upx() {
    if ! command -v upx &> /dev/null; then
        if ! sudo -v &> /dev/null; then
            log error "You do not have permission to install UPX."
            log warn "If you want binary packing, please install UPX manually."
            log warn "See: https://upx.github.io/"
            return 1
        fi
        if [[ "$(uname)" == "Darwin" ]]; then
            brew install upx >/dev/null
        elif command -v apt-get &> /dev/null; then
            sudo apt-get install -y upx-ucl >/dev/null
        elif command -v yum &> /dev/null; then
            sudo yum install -y upx-ucl >/dev/null
        elif command -v dnf &> /dev/null; then
            sudo dnf install -y upx-ucl >/dev/null
        elif command -v pacman &> /dev/null; then
            sudo pacman -S --noconfirm upx-ucl >/dev/null
        elif command -v zypper &> /dev/null; then
            sudo zypper install -y upx-ucl >/dev/null
        elif command -v apk &> /dev/null; then
            sudo apk add upx-ucl >/dev/null
        elif command -v port &> /dev/null; then
            sudo port install upx-ucl >/dev/null
        elif command -v snap &> /dev/null; then
            sudo snap install upx >/dev/null
        elif command -v flatpak &> /dev/null; then
            sudo flatpak install flathub org.uptane.upx -y >/dev/null
        else
            log warn "If you want binary packing, please install UPX manually."
            log warn "See: https://upx.github.io/"
            return 1
        fi
    fi

    return 0
}
detect_shell_rc() {
    local shell_rc_file
    local user_shell
    user_shell=$(basename "$SHELL")

    case "$user_shell" in
        bash) shell_rc_file="${HOME:-~}/.bashrc" ;;
        zsh) shell_rc_file="${HOME:-~}/.zshrc" ;;
        sh) shell_rc_file="${HOME:-~}/.profile" ;;
        fish) shell_rc_file="${HOME:-~}/.config/fish/config.fish" ;;
        *)
            log warn "Unsupported shell: $user_shell"
            log warn "Please add the path manually to your shell configuration file."
            log warn "Supported shells: bash, zsh, sh, fish"
            return 1
            ;;
    esac

    if [ ! -f "$shell_rc_file" ]; then
        log error "Configuration file not found: ${shell_rc_file}"
        return 1
    fi

    echo "$shell_rc_file"

    return 0
}
add_to_path() {
    local target_path="${1:-}"

    local shell_rc_file=""

    local path_expression=""

    path_expression="export PATH=\"${target_path}:\$PATH\""

    shell_rc_file="$(detect_shell_rc)"

    if [[ -z "$shell_rc_file" ]]; then
        log error "Could not identify the shell configuration file."
        return 1
    fi
    if grep -q "${path_expression}" "$shell_rc_file" 2>/dev/null; then
        log success "$target_path is already in PATH for $shell_rc_file."
        return 0
    fi

    if [[ -z "${target_path}" ]]; then
        log error "Target path not provided."
        return 1
    fi

    if [[ ! -d "${target_path}" ]]; then
        log error "Target path is not a valid directory: $target_path"
        return 1
    fi

    if [[ ! -f "${shell_rc_file}" ]]; then
        log error "Configuration file not found: ${shell_rc_file}"
        return 1
    fi

    # echo "export PATH=${target_path}:\$PATH" >> "$shell_rc_file"
    printf '%s\n' "${path_expression}" | tee -a "$shell_rc_file" >/dev/null || {
        log error "Failed to add $target_path to PATH in $shell_rc_file."
        return 1
    }

    log success "Added $target_path to PATH in $shell_rc_file."

    "$SHELL" -c "source ${shell_rc_file}" || {
        log warn "Failed to reload shell. Please run 'source ${shell_rc_file}' manually."
    }

    return 0
}
check_path() {
    log info "Checking if $1 is in PATH..."
    if ! echo "$PATH" | grep -q "$1"; then
        log warn "$1 is not in PATH."
        log warn "Add: export PATH=$1:\$PATH"
    else
        log success "$1 is already in PATH."
    fi
}

export -f install_upx
export -f detect_shell_rc
export -f add_to_path
export -f check_path
