#!/usr/bin/env bash
# shellcheck disable=SC2065,SC2015

set -o nounset  # Treat unset variables as an error
set -o errexit  # Exit immediately if a command exits with a non-zero status
set -o pipefail # Prevent errors in a pipeline from being masked
set -o errtrace # If a command fails, the shell will exit immediately
set -o functrace # If a function fails, the shell will exit immediately
shopt -s inherit_errexit # Inherit the errexit option in functions

IFS=$'\n\t'

__source_script_if_needed() {
  local _check_declare="${1:-}"
  local _script_path="${2:-}"
  # shellcheck disable=SC2065
  if test -z "$(declare -f "${_check_declare:-}")" >/dev/null; then
    # shellcheck source=/dev/null
    source "${_script_path:-}" || {
      echo "Error: Could not source ${_script_path:-}. Please ensure it exists." >&2
      return 1
    }
  fi
  return 0
}

_ROOT_DIR="${_ROOT_DIR:-$(git rev-parse --show-toplevel)}"
__source_script_if_needed "get_current_shell" "${_ROOT_DIR:-}/support/utils.sh" || {
  echo "Error: Could not source utils.sh. Please ensure it exists." >&2
  exit 1
}

build_project() {
  local _ROOT_DIR="${_ROOT_DIR:-$(git rev-parse --show-toplevel)}"

  if [[ ! -d "${_ROOT_DIR}" ]]; then
      echo "Project directory does not exist."
      exit 1
  fi

  cd "${_ROOT_DIR}" || {
    log fatal "Failed to change directory to ${_ROOT_DIR}" || echo "Failed to change directory to ${_ROOT_DIR}" >&2
    exit 1
  }

  if command -v pnpm &>/dev/null; then
      log info "Building project..." true

      _project_install_output="$(pnpm install --no-strict-peer-dependencies --no-use-stderr --force > /dev/null 2>&1 || {
          echo "Failed to install project dependencies."
      })"

      _project_build_output="$(pnpm compile > /dev/null 2>&1 || {
          echo "Failed to build project assets."
      })"

      if [[ "${_project_build_output:-}" == "Failed to build project assets." ]] || [[ -n "${_project_build_output:-}" && "${_QUIET:-false}" != "true" ]]; then
          log error "${_project_build_output}" true
          log fatal "Project build failed." true
          exit 1
      fi

      if [[ -d "${_ROOT_DIR}/dist" ]]; then
          log success "Project assets built successfully." true
      else
          log fatal "Build directory does not exist." true
          exit 1
      fi
  else
      log fatal "pnpm is not installed. Please install Node.js and pnpm to continue." true
      exit 1
  fi
}

(build_project) || {
  log fatal "An error occurred during the pre-build process." | tee /dev/stderr
  exit 1
}
