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

predicate isRouteFile(File file) {
  file.getRelativePath().regexpMatch("backend/routes/.*\\.js")
}

predicate isControllerFile(File file) {
  file.getRelativePath().regexpMatch("backend/controllers/.*\\.js")
}

predicate isServiceFile(File file) {
  file.getRelativePath().regexpMatch("backend/services/.*\\.js")
}

predicate isRepositoryFile(File file) {
  file.getRelativePath().regexpMatch("backend/repositories/.*\\.js")
}

predicate isModelFile(File file) {
  file.getRelativePath().regexpMatch("backend/models/.*\\.js")
}

predicate isRequireCall(CallExpr call, string importedPath) {
  exists(StringLiteral modulePath |
    call.getCallee().toString() = "require" and
    call.getArgument(0) = modulePath and
    importedPath = modulePath.getValue()
  )
}

predicate architectureViolation(CallExpr call, string importedPath, string message) {
  isRequireCall(call, importedPath) and
  (
    (
      isRouteFile(call.getFile()) and
      importedPath.regexpMatch("\\.\\./(services|repositories|models)/.*") and
      message = "Routes must call controllers only. Do not import services, repositories, or models from routes."
    )
    or
    (
      isControllerFile(call.getFile()) and
      importedPath.regexpMatch("\\.\\./(repositories|models)/.*") and
      message = "Controllers must call services only. Do not import repositories or models from controllers."
    )
    or
    (
      isServiceFile(call.getFile()) and
      importedPath.regexpMatch("\\.\\./models/.*") and
      message = "Services must use repositories for database access. Do not import models from services."
    )
    or
    (
      isRepositoryFile(call.getFile()) and
      importedPath.regexpMatch("\\.\\./(routes|controllers|services)/.*") and
      message = "Repositories must not depend on routes, controllers, or services."
    )
    or
    (
      isModelFile(call.getFile()) and
      importedPath.regexpMatch("\\.\\./(routes|controllers|services|repositories)/.*") and
      message = "Models must not depend on application layers."
    )
  )
}

from CallExpr call, string importedPath, string message
where architectureViolation(call, importedPath, message)
select call, message + " Imported path: '" + importedPath + "'."