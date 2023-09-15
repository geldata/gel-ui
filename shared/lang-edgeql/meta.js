export const reserved_keywords = [
  "__edgedbsys__",
  "__edgedbtpl__",
  "__new__",
  "__old__",
  "__source__",
  "__specified__",
  "__std__",
  "__subject__",
  "__type__",
  "administer",
  "alter",
  "analyze",
  "and",
  "anyarray",
  "anytuple",
  "anytype",
  "begin",
  "by",
  "case",
  "check",
  "commit",
  "configure",
  "create",
  "deallocate",
  "delete",
  "describe",
  "detached",
  "discard",
  "distinct",
  "do",
  "drop",
  "else",
  "end",
  "except",
  "exists",
  "explain",
  "extending",
  "fetch",
  "filter",
  "for",
  "get",
  "global",
  "grant",
  "group",
  "if",
  "ilike",
  "import",
  "in",
  "insert",
  "intersect",
  "introspect",
  "is",
  "like",
  "limit",
  "listen",
  "load",
  "lock",
  "match",
  "module",
  "move",
  "never",
  "not",
  "notify",
  "offset",
  "on",
  "optional",
  "or",
  "over",
  "partition",
  "prepare",
  "raise",
  "refresh",
  "revoke",
  "rollback",
  "select",
  "set",
  "single",
  "start",
  "typeof",
  "union",
  "update",
  "variadic",
  "when",
  "window",
  "with",
];

export const unreserved_keywords = [
  "abort",
  "abstract",
  "access",
  "after",
  "alias",
  "all",
  "allow",
  "annotation",
  "applied",
  "as",
  "asc",
  "assignment",
  "before",
  "cardinality",
  "cast",
  "committed",
  "config",
  "conflict",
  "constraint",
  "cube",
  "current",
  "database",
  "ddl",
  "declare",
  "default",
  "deferrable",
  "deferred",
  "delegated",
  "deny",
  "desc",
  "each",
  "empty",
  "expression",
  "extension",
  "final",
  "first",
  "from",
  "function",
  "future",
  "implicit",
  "index",
  "infix",
  "inheritable",
  "instance",
  "into",
  "isolation",
  // "json",
  "last",
  "link",
  "migration",
  "multi",
  "named",
  "object",
  "of",
  "only",
  "onto",
  "operator",
  "optionality",
  "order",
  "orphan",
  "overloaded",
  "owned",
  "package",
  "policy",
  "populate",
  "postfix",
  "prefix",
  "property",
  "proposed",
  "pseudo",
  "read",
  "reject",
  "release",
  "rename",
  "required",
  "reset",
  "restrict",
  "rewrite",
  "role",
  "roles",
  "rollup",
  "savepoint",
  "scalar",
  "schema",
  "sdl",
  "serializable",
  "session",
  "source",
  "superuser",
  "system",
  "target",
  "ternary",
  "text",
  "then",
  "to",
  "transaction",
  "trigger",
  "type",
  "unless",
  "using",
  "verbose",
  "version",
  "view",
  "write",
];

export const bool_literals = ["false", "true"];

export const type_builtins = [
  "BaseObject",
  "FreeObject",
  "JsonEmpty",
  "Object",
  "anycontiguous",
  "anydiscrete",
  "anyenum",
  "anyfloat",
  "anyint",
  "anynumeric",
  "anypoint",
  "anyreal",
  "anyscalar",
  // "array",
  "bigint",
  "bool",
  "bytes",
  "date_duration",
  "datetime",
  "decimal",
  "duration",
  "enum",
  "float32",
  "float64",
  "int16",
  "int32",
  "int64",
  "json",
  "local_date",
  "local_datetime",
  "local_time",
  "range",
  "relative_duration",
  "sequence",
  "str",
  // "tuple",
  "uuid",
];

export const module_builtins = [
  "cal",
  "cfg",
  "ext",
  "fts",
  "math",
  "pg",
  "schema",
  "std",
  "sys",
];

export const constraint_builtins = [
  "constraint",
  "exclusive",
  "expression",
  "len_value",
  "max_ex_value",
  "max_len_value",
  "max_value",
  "min_ex_value",
  "min_len_value",
  "min_value",
  "one_of",
  "regexp",
];

export const fn_builtins = [
  "abs",
  "adjacent",
  "all",
  "any",
  "array_agg",
  "array_fill",
  "array_get",
  "array_join",
  "array_replace",
  "array_unpack",
  "assert",
  "assert_distinct",
  "assert_exists",
  "assert_single",
  "bit_and",
  "bit_lshift",
  "bit_not",
  "bit_or",
  "bit_rshift",
  "bit_xor",
  "bounded_above",
  "bounded_below",
  "bytes_get_bit",
  "ceil",
  "contains",
  "count",
  "date_get",
  "datetime_current",
  "datetime_get",
  "datetime_of_statement",
  "datetime_of_transaction",
  "datetime_truncate",
  "duration_get",
  "duration_normalize_days",
  "duration_normalize_hours",
  "duration_to_seconds",
  "duration_truncate",
  "enumerate",
  "find",
  "floor",
  "get_current_database",
  "get_instance_name",
  "get_transaction_isolation",
  "get_version",
  "get_version_as_str",
  "json_array_unpack",
  "json_get",
  "json_object_pack",
  "json_object_unpack",
  "json_set",
  "json_typeof",
  "len",
  "lg",
  "ln",
  "log",
  "max",
  "mean",
  "min",
  "multirange",
  "multirange_unpack",
  "overlaps",
  "random",
  "range",
  "range_get_lower",
  "range_get_upper",
  "range_is_empty",
  "range_is_inclusive_lower",
  "range_is_inclusive_upper",
  "range_unpack",
  "re_match",
  "re_match_all",
  "re_replace",
  "re_test",
  "round",
  "sequence_next",
  "sequence_reset",
  "sqrt",
  "stddev",
  "stddev_pop",
  "str_lower",
  "str_lpad",
  "str_ltrim",
  "str_pad_end",
  "str_pad_start",
  "str_repeat",
  "str_replace",
  "str_reverse",
  "str_rpad",
  "str_rtrim",
  "str_split",
  "str_title",
  "str_trim",
  "str_trim_end",
  "str_trim_start",
  "str_upper",
  "strictly_above",
  "strictly_below",
  "sum",
  "time_get",
  "to_bigint",
  "to_date_duration",
  "to_datetime",
  "to_decimal",
  "to_duration",
  "to_float32",
  "to_float64",
  "to_int16",
  "to_int32",
  "to_int64",
  "to_json",
  "to_local_date",
  "to_local_datetime",
  "to_local_time",
  "to_relative_duration",
  "to_str",
  "uuid_generate_v1mc",
  "uuid_generate_v4",
  "var",
  "var_pop",
];

export const operators = [
  "!=",
  "%",
  "*",
  "+",
  "++",
  "-",
  "/",
  "//",
  ":=",
  "<",
  "<=",
  "=",
  ">",
  ">=",
  "?!=",
  "?=",
  "??",
  "^",
];

export const navigation = [".<", ".>", "@", "."];
