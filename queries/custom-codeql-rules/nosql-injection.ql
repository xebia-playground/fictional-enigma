/**
 * @name User-controlled MongoDB query
 * @description Detects Express request input flowing into Mongoose query methods.
 * @kind path-problem
 * @problem.severity warning
 * @security-severity 8.0
 * @precision medium
 * @id js/devshop/nosql-injection
 * @tags security
 *       external/cwe/cwe-943
 */

import javascript
import DataFlow::PathGraph

class ExpressRequestInput extends DataFlow::Node {
  ExpressRequestInput() {
    exists(PropAccess prop |
      prop.getPropertyName() = ["query", "body", "params"] and
      this.asExpr() = prop
    )
  }
}

class MongooseQuerySink extends DataFlow::Node {
  MongooseQuerySink() {
    exists(CallExpr call, PropAccess callee |
      call.getCallee() = callee and
      callee.getPropertyName() = ["find", "findOne", "findOneAndUpdate", "deleteMany", "updateMany"] and
      this.asExpr() = call.getArgument(0)
    )
  }
}

module MongoQueryConfig implements DataFlow::ConfigSig {
  predicate isSource(DataFlow::Node source) {
    source instanceof ExpressRequestInput
  }

  predicate isSink(DataFlow::Node sink) {
    sink instanceof MongooseQuerySink
  }
}

module MongoQueryFlow = DataFlow::Global<MongoQueryConfig>;

from MongoQueryFlow::PathNode source, MongoQueryFlow::PathNode sink
where MongoQueryFlow::flowPath(source, sink)
select sink.getNode(), source, sink,
  "User-controlled request data flows into a MongoDB query method."