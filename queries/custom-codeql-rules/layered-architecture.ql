/**
 * @name Backend layered architecture violation
 * @description Enforces backend dependency direction: routes -> controllers -> services -> repositories -> models.
 * @kind problem
 * @problem.severity warning
 * @security-severity 5.0
 * @precision high
 * @id js/devshop/layered-architecture
 * @tags maintainability
 *       architecture
 *       security
 *       external/cwe/cwe-710
 */

import javascript

predicate isBackendLayer(File file, string layer) {
  file.getRelativePath().regexpMatch("backend/" + layer + "/.*\\.js")
}

predicate isRequireCall(CallExpr call, string importedPath) {
  exists(StringLiteral modulePath |
    call.getCallee().toString() = "require" and
    call.getArgument(0) = modulePath and
    importedPath = modulePath.getValue()
  )
}

predicate architectureViolation(CallExpr call, string message) {
  exists(string importedPath |
    isRequireCall(call, importedPath) and
    (
      isBackendLayer(call.getFile(), "routes") and
      importedPath.regexpMatch("\\.\\./(services|repositories|models)/.*") and
      message = "Routes must call controllers only. Do not import services, repositories, or models from routes."
      or
      isBackendLayer(call.getFile(), "controllers") and
      importedPath.regexpMatch("\\.\\./(repositories|models)/.*") and
      message = "Controllers must call services only. Do not import repositories or models from controllers."
      or
      isBackendLayer(call.getFile(), "services") and
      importedPath.regexpMatch("\\.\\./models/.*") and
      message = "Services must use repositories for database access. Do not import models from services."
      or
      isBackendLayer(call.getFile(), "repositories") and
      importedPath.regexpMatch("\\.\\./(routes|controllers|services)/.*") and
      message = "Repositories must not depend on routes, controllers, or services."
      or
      isBackendLayer(call.getFile(), "models") and
      importedPath.regexpMatch("\\.\\./(routes|controllers|services|repositories)/.*") and
      message = "Models must not depend on application layers."
    )
  )
}

from CallExpr call, string message
where architectureViolation(call, message)
select call, message