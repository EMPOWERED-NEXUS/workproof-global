
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model WorkerProfile
 * 
 */
export type WorkerProfile = $Result.DefaultSelection<Prisma.$WorkerProfilePayload>
/**
 * Model Organisation
 * 
 */
export type Organisation = $Result.DefaultSelection<Prisma.$OrganisationPayload>
/**
 * Model WorkReceipt
 * 
 */
export type WorkReceipt = $Result.DefaultSelection<Prisma.$WorkReceiptPayload>
/**
 * Model Evidence
 * 
 */
export type Evidence = $Result.DefaultSelection<Prisma.$EvidencePayload>
/**
 * Model VerificationRequest
 * 
 */
export type VerificationRequest = $Result.DefaultSelection<Prisma.$VerificationRequestPayload>
/**
 * Model Confirmation
 * 
 */
export type Confirmation = $Result.DefaultSelection<Prisma.$ConfirmationPayload>
/**
 * Model Dispute
 * 
 */
export type Dispute = $Result.DefaultSelection<Prisma.$DisputePayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  WORKER: 'WORKER',
  ORGANISATION: 'ORGANISATION',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const UserStatus: {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const ReceiptStatus: {
  DRAFT: 'DRAFT',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  VERIFIED: 'VERIFIED',
  CORRECTION_REQUESTED: 'CORRECTION_REQUESTED',
  DISPUTED: 'DISPUTED',
  REVOKED: 'REVOKED',
  ARCHIVED: 'ARCHIVED'
};

export type ReceiptStatus = (typeof ReceiptStatus)[keyof typeof ReceiptStatus]


export const Visibility: {
  PRIVATE: 'PRIVATE',
  UNLISTED: 'UNLISTED',
  PUBLIC: 'PUBLIC'
};

export type Visibility = (typeof Visibility)[keyof typeof Visibility]


export const EvidenceType: {
  IMAGE: 'IMAGE',
  DOCUMENT: 'DOCUMENT',
  LINK: 'LINK'
};

export type EvidenceType = (typeof EvidenceType)[keyof typeof EvidenceType]


export const ConfirmationDecision: {
  CONFIRMED: 'CONFIRMED',
  CORRECTION_REQUESTED: 'CORRECTION_REQUESTED',
  DISPUTED: 'DISPUTED'
};

export type ConfirmationDecision = (typeof ConfirmationDecision)[keyof typeof ConfirmationDecision]


export const DisputeStatus: {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

export type ReceiptStatus = $Enums.ReceiptStatus

export const ReceiptStatus: typeof $Enums.ReceiptStatus

export type Visibility = $Enums.Visibility

export const Visibility: typeof $Enums.Visibility

export type EvidenceType = $Enums.EvidenceType

export const EvidenceType: typeof $Enums.EvidenceType

export type ConfirmationDecision = $Enums.ConfirmationDecision

export const ConfirmationDecision: typeof $Enums.ConfirmationDecision

export type DisputeStatus = $Enums.DisputeStatus

export const DisputeStatus: typeof $Enums.DisputeStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workerProfile`: Exposes CRUD operations for the **WorkerProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkerProfiles
    * const workerProfiles = await prisma.workerProfile.findMany()
    * ```
    */
  get workerProfile(): Prisma.WorkerProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organisation`: Exposes CRUD operations for the **Organisation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organisations
    * const organisations = await prisma.organisation.findMany()
    * ```
    */
  get organisation(): Prisma.OrganisationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workReceipt`: Exposes CRUD operations for the **WorkReceipt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkReceipts
    * const workReceipts = await prisma.workReceipt.findMany()
    * ```
    */
  get workReceipt(): Prisma.WorkReceiptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.evidence`: Exposes CRUD operations for the **Evidence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Evidences
    * const evidences = await prisma.evidence.findMany()
    * ```
    */
  get evidence(): Prisma.EvidenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationRequest`: Exposes CRUD operations for the **VerificationRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationRequests
    * const verificationRequests = await prisma.verificationRequest.findMany()
    * ```
    */
  get verificationRequest(): Prisma.VerificationRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.confirmation`: Exposes CRUD operations for the **Confirmation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Confirmations
    * const confirmations = await prisma.confirmation.findMany()
    * ```
    */
  get confirmation(): Prisma.ConfirmationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dispute`: Exposes CRUD operations for the **Dispute** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Disputes
    * const disputes = await prisma.dispute.findMany()
    * ```
    */
  get dispute(): Prisma.DisputeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    WorkerProfile: 'WorkerProfile',
    Organisation: 'Organisation',
    WorkReceipt: 'WorkReceipt',
    Evidence: 'Evidence',
    VerificationRequest: 'VerificationRequest',
    Confirmation: 'Confirmation',
    Dispute: 'Dispute',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "workerProfile" | "organisation" | "workReceipt" | "evidence" | "verificationRequest" | "confirmation" | "dispute" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      WorkerProfile: {
        payload: Prisma.$WorkerProfilePayload<ExtArgs>
        fields: Prisma.WorkerProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkerProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkerProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>
          }
          findFirst: {
            args: Prisma.WorkerProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkerProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>
          }
          findMany: {
            args: Prisma.WorkerProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>[]
          }
          create: {
            args: Prisma.WorkerProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>
          }
          createMany: {
            args: Prisma.WorkerProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkerProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>[]
          }
          delete: {
            args: Prisma.WorkerProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>
          }
          update: {
            args: Prisma.WorkerProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>
          }
          deleteMany: {
            args: Prisma.WorkerProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkerProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkerProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>[]
          }
          upsert: {
            args: Prisma.WorkerProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerProfilePayload>
          }
          aggregate: {
            args: Prisma.WorkerProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkerProfile>
          }
          groupBy: {
            args: Prisma.WorkerProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkerProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkerProfileCountArgs<ExtArgs>
            result: $Utils.Optional<WorkerProfileCountAggregateOutputType> | number
          }
        }
      }
      Organisation: {
        payload: Prisma.$OrganisationPayload<ExtArgs>
        fields: Prisma.OrganisationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganisationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganisationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          findFirst: {
            args: Prisma.OrganisationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganisationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          findMany: {
            args: Prisma.OrganisationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>[]
          }
          create: {
            args: Prisma.OrganisationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          createMany: {
            args: Prisma.OrganisationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganisationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>[]
          }
          delete: {
            args: Prisma.OrganisationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          update: {
            args: Prisma.OrganisationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          deleteMany: {
            args: Prisma.OrganisationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganisationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganisationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>[]
          }
          upsert: {
            args: Prisma.OrganisationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          aggregate: {
            args: Prisma.OrganisationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganisation>
          }
          groupBy: {
            args: Prisma.OrganisationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganisationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganisationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganisationCountAggregateOutputType> | number
          }
        }
      }
      WorkReceipt: {
        payload: Prisma.$WorkReceiptPayload<ExtArgs>
        fields: Prisma.WorkReceiptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkReceiptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkReceiptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>
          }
          findFirst: {
            args: Prisma.WorkReceiptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkReceiptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>
          }
          findMany: {
            args: Prisma.WorkReceiptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>[]
          }
          create: {
            args: Prisma.WorkReceiptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>
          }
          createMany: {
            args: Prisma.WorkReceiptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkReceiptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>[]
          }
          delete: {
            args: Prisma.WorkReceiptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>
          }
          update: {
            args: Prisma.WorkReceiptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>
          }
          deleteMany: {
            args: Prisma.WorkReceiptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkReceiptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkReceiptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>[]
          }
          upsert: {
            args: Prisma.WorkReceiptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkReceiptPayload>
          }
          aggregate: {
            args: Prisma.WorkReceiptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkReceipt>
          }
          groupBy: {
            args: Prisma.WorkReceiptGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkReceiptGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkReceiptCountArgs<ExtArgs>
            result: $Utils.Optional<WorkReceiptCountAggregateOutputType> | number
          }
        }
      }
      Evidence: {
        payload: Prisma.$EvidencePayload<ExtArgs>
        fields: Prisma.EvidenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EvidenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EvidenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>
          }
          findFirst: {
            args: Prisma.EvidenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EvidenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>
          }
          findMany: {
            args: Prisma.EvidenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>[]
          }
          create: {
            args: Prisma.EvidenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>
          }
          createMany: {
            args: Prisma.EvidenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EvidenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>[]
          }
          delete: {
            args: Prisma.EvidenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>
          }
          update: {
            args: Prisma.EvidenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>
          }
          deleteMany: {
            args: Prisma.EvidenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EvidenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EvidenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>[]
          }
          upsert: {
            args: Prisma.EvidenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePayload>
          }
          aggregate: {
            args: Prisma.EvidenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvidence>
          }
          groupBy: {
            args: Prisma.EvidenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<EvidenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.EvidenceCountArgs<ExtArgs>
            result: $Utils.Optional<EvidenceCountAggregateOutputType> | number
          }
        }
      }
      VerificationRequest: {
        payload: Prisma.$VerificationRequestPayload<ExtArgs>
        fields: Prisma.VerificationRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>
          }
          findFirst: {
            args: Prisma.VerificationRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>
          }
          findMany: {
            args: Prisma.VerificationRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>[]
          }
          create: {
            args: Prisma.VerificationRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>
          }
          createMany: {
            args: Prisma.VerificationRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>[]
          }
          delete: {
            args: Prisma.VerificationRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>
          }
          update: {
            args: Prisma.VerificationRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>
          }
          deleteMany: {
            args: Prisma.VerificationRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>[]
          }
          upsert: {
            args: Prisma.VerificationRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationRequestPayload>
          }
          aggregate: {
            args: Prisma.VerificationRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationRequest>
          }
          groupBy: {
            args: Prisma.VerificationRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationRequestCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationRequestCountAggregateOutputType> | number
          }
        }
      }
      Confirmation: {
        payload: Prisma.$ConfirmationPayload<ExtArgs>
        fields: Prisma.ConfirmationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfirmationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfirmationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>
          }
          findFirst: {
            args: Prisma.ConfirmationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfirmationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>
          }
          findMany: {
            args: Prisma.ConfirmationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>[]
          }
          create: {
            args: Prisma.ConfirmationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>
          }
          createMany: {
            args: Prisma.ConfirmationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfirmationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>[]
          }
          delete: {
            args: Prisma.ConfirmationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>
          }
          update: {
            args: Prisma.ConfirmationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>
          }
          deleteMany: {
            args: Prisma.ConfirmationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfirmationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConfirmationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>[]
          }
          upsert: {
            args: Prisma.ConfirmationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfirmationPayload>
          }
          aggregate: {
            args: Prisma.ConfirmationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfirmation>
          }
          groupBy: {
            args: Prisma.ConfirmationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfirmationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfirmationCountArgs<ExtArgs>
            result: $Utils.Optional<ConfirmationCountAggregateOutputType> | number
          }
        }
      }
      Dispute: {
        payload: Prisma.$DisputePayload<ExtArgs>
        fields: Prisma.DisputeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DisputeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DisputeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>
          }
          findFirst: {
            args: Prisma.DisputeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DisputeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>
          }
          findMany: {
            args: Prisma.DisputeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>[]
          }
          create: {
            args: Prisma.DisputeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>
          }
          createMany: {
            args: Prisma.DisputeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DisputeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>[]
          }
          delete: {
            args: Prisma.DisputeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>
          }
          update: {
            args: Prisma.DisputeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>
          }
          deleteMany: {
            args: Prisma.DisputeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DisputeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DisputeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>[]
          }
          upsert: {
            args: Prisma.DisputeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisputePayload>
          }
          aggregate: {
            args: Prisma.DisputeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDispute>
          }
          groupBy: {
            args: Prisma.DisputeGroupByArgs<ExtArgs>
            result: $Utils.Optional<DisputeGroupByOutputType>[]
          }
          count: {
            args: Prisma.DisputeCountArgs<ExtArgs>
            result: $Utils.Optional<DisputeCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    workerProfile?: WorkerProfileOmit
    organisation?: OrganisationOmit
    workReceipt?: WorkReceiptOmit
    evidence?: EvidenceOmit
    verificationRequest?: VerificationRequestOmit
    confirmation?: ConfirmationOmit
    dispute?: DisputeOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    receipts: number
    auditLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipts?: boolean | UserCountOutputTypeCountReceiptsArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceiptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkReceiptWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type WorkReceiptCountOutputType
   */

  export type WorkReceiptCountOutputType = {
    evidence: number
    auditLogs: number
  }

  export type WorkReceiptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evidence?: boolean | WorkReceiptCountOutputTypeCountEvidenceArgs
    auditLogs?: boolean | WorkReceiptCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * WorkReceiptCountOutputType without action
   */
  export type WorkReceiptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceiptCountOutputType
     */
    select?: WorkReceiptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkReceiptCountOutputType without action
   */
  export type WorkReceiptCountOutputTypeCountEvidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvidenceWhereInput
  }

  /**
   * WorkReceiptCountOutputType without action
   */
  export type WorkReceiptCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    fullName: string | null
    role: $Enums.UserRole | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    fullName: string | null
    role: $Enums.UserRole | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    fullName: number
    role: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    fullName?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    fullName?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    fullName?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    fullName: string
    role: $Enums.UserRole
    status: $Enums.UserStatus
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    fullName?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workerProfile?: boolean | User$workerProfileArgs<ExtArgs>
    organisation?: boolean | User$organisationArgs<ExtArgs>
    receipts?: boolean | User$receiptsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    fullName?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    fullName?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    fullName?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "fullName" | "role" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workerProfile?: boolean | User$workerProfileArgs<ExtArgs>
    organisation?: boolean | User$organisationArgs<ExtArgs>
    receipts?: boolean | User$receiptsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      workerProfile: Prisma.$WorkerProfilePayload<ExtArgs> | null
      organisation: Prisma.$OrganisationPayload<ExtArgs> | null
      receipts: Prisma.$WorkReceiptPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      fullName: string
      role: $Enums.UserRole
      status: $Enums.UserStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workerProfile<T extends User$workerProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$workerProfileArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    organisation<T extends User$organisationArgs<ExtArgs> = {}>(args?: Subset<T, User$organisationArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    receipts<T extends User$receiptsArgs<ExtArgs> = {}>(args?: Subset<T, User$receiptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly status: FieldRef<"User", 'UserStatus'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.workerProfile
   */
  export type User$workerProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    where?: WorkerProfileWhereInput
  }

  /**
   * User.organisation
   */
  export type User$organisationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    where?: OrganisationWhereInput
  }

  /**
   * User.receipts
   */
  export type User$receiptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    where?: WorkReceiptWhereInput
    orderBy?: WorkReceiptOrderByWithRelationInput | WorkReceiptOrderByWithRelationInput[]
    cursor?: WorkReceiptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkReceiptScalarFieldEnum | WorkReceiptScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model WorkerProfile
   */

  export type AggregateWorkerProfile = {
    _count: WorkerProfileCountAggregateOutputType | null
    _min: WorkerProfileMinAggregateOutputType | null
    _max: WorkerProfileMaxAggregateOutputType | null
  }

  export type WorkerProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    headline: string | null
    bio: string | null
    location: string | null
    phone: string | null
    profileSlug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkerProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    headline: string | null
    bio: string | null
    location: string | null
    phone: string | null
    profileSlug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkerProfileCountAggregateOutputType = {
    id: number
    userId: number
    headline: number
    bio: number
    location: number
    phone: number
    skills: number
    profileSlug: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkerProfileMinAggregateInputType = {
    id?: true
    userId?: true
    headline?: true
    bio?: true
    location?: true
    phone?: true
    profileSlug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkerProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    headline?: true
    bio?: true
    location?: true
    phone?: true
    profileSlug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkerProfileCountAggregateInputType = {
    id?: true
    userId?: true
    headline?: true
    bio?: true
    location?: true
    phone?: true
    skills?: true
    profileSlug?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkerProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkerProfile to aggregate.
     */
    where?: WorkerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkerProfiles to fetch.
     */
    orderBy?: WorkerProfileOrderByWithRelationInput | WorkerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkerProfiles
    **/
    _count?: true | WorkerProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkerProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkerProfileMaxAggregateInputType
  }

  export type GetWorkerProfileAggregateType<T extends WorkerProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkerProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkerProfile[P]>
      : GetScalarType<T[P], AggregateWorkerProfile[P]>
  }




  export type WorkerProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkerProfileWhereInput
    orderBy?: WorkerProfileOrderByWithAggregationInput | WorkerProfileOrderByWithAggregationInput[]
    by: WorkerProfileScalarFieldEnum[] | WorkerProfileScalarFieldEnum
    having?: WorkerProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkerProfileCountAggregateInputType | true
    _min?: WorkerProfileMinAggregateInputType
    _max?: WorkerProfileMaxAggregateInputType
  }

  export type WorkerProfileGroupByOutputType = {
    id: string
    userId: string
    headline: string | null
    bio: string | null
    location: string | null
    phone: string | null
    skills: string[]
    profileSlug: string
    createdAt: Date
    updatedAt: Date
    _count: WorkerProfileCountAggregateOutputType | null
    _min: WorkerProfileMinAggregateOutputType | null
    _max: WorkerProfileMaxAggregateOutputType | null
  }

  type GetWorkerProfileGroupByPayload<T extends WorkerProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkerProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkerProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkerProfileGroupByOutputType[P]>
            : GetScalarType<T[P], WorkerProfileGroupByOutputType[P]>
        }
      >
    >


  export type WorkerProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    headline?: boolean
    bio?: boolean
    location?: boolean
    phone?: boolean
    skills?: boolean
    profileSlug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workerProfile"]>

  export type WorkerProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    headline?: boolean
    bio?: boolean
    location?: boolean
    phone?: boolean
    skills?: boolean
    profileSlug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workerProfile"]>

  export type WorkerProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    headline?: boolean
    bio?: boolean
    location?: boolean
    phone?: boolean
    skills?: boolean
    profileSlug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workerProfile"]>

  export type WorkerProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    headline?: boolean
    bio?: boolean
    location?: boolean
    phone?: boolean
    skills?: boolean
    profileSlug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkerProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "headline" | "bio" | "location" | "phone" | "skills" | "profileSlug" | "createdAt" | "updatedAt", ExtArgs["result"]["workerProfile"]>
  export type WorkerProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WorkerProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WorkerProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WorkerProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkerProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      headline: string | null
      bio: string | null
      location: string | null
      phone: string | null
      skills: string[]
      profileSlug: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workerProfile"]>
    composites: {}
  }

  type WorkerProfileGetPayload<S extends boolean | null | undefined | WorkerProfileDefaultArgs> = $Result.GetResult<Prisma.$WorkerProfilePayload, S>

  type WorkerProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkerProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkerProfileCountAggregateInputType | true
    }

  export interface WorkerProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkerProfile'], meta: { name: 'WorkerProfile' } }
    /**
     * Find zero or one WorkerProfile that matches the filter.
     * @param {WorkerProfileFindUniqueArgs} args - Arguments to find a WorkerProfile
     * @example
     * // Get one WorkerProfile
     * const workerProfile = await prisma.workerProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkerProfileFindUniqueArgs>(args: SelectSubset<T, WorkerProfileFindUniqueArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkerProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkerProfileFindUniqueOrThrowArgs} args - Arguments to find a WorkerProfile
     * @example
     * // Get one WorkerProfile
     * const workerProfile = await prisma.workerProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkerProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkerProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkerProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerProfileFindFirstArgs} args - Arguments to find a WorkerProfile
     * @example
     * // Get one WorkerProfile
     * const workerProfile = await prisma.workerProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkerProfileFindFirstArgs>(args?: SelectSubset<T, WorkerProfileFindFirstArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkerProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerProfileFindFirstOrThrowArgs} args - Arguments to find a WorkerProfile
     * @example
     * // Get one WorkerProfile
     * const workerProfile = await prisma.workerProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkerProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkerProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkerProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkerProfiles
     * const workerProfiles = await prisma.workerProfile.findMany()
     * 
     * // Get first 10 WorkerProfiles
     * const workerProfiles = await prisma.workerProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workerProfileWithIdOnly = await prisma.workerProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkerProfileFindManyArgs>(args?: SelectSubset<T, WorkerProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkerProfile.
     * @param {WorkerProfileCreateArgs} args - Arguments to create a WorkerProfile.
     * @example
     * // Create one WorkerProfile
     * const WorkerProfile = await prisma.workerProfile.create({
     *   data: {
     *     // ... data to create a WorkerProfile
     *   }
     * })
     * 
     */
    create<T extends WorkerProfileCreateArgs>(args: SelectSubset<T, WorkerProfileCreateArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkerProfiles.
     * @param {WorkerProfileCreateManyArgs} args - Arguments to create many WorkerProfiles.
     * @example
     * // Create many WorkerProfiles
     * const workerProfile = await prisma.workerProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkerProfileCreateManyArgs>(args?: SelectSubset<T, WorkerProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkerProfiles and returns the data saved in the database.
     * @param {WorkerProfileCreateManyAndReturnArgs} args - Arguments to create many WorkerProfiles.
     * @example
     * // Create many WorkerProfiles
     * const workerProfile = await prisma.workerProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkerProfiles and only return the `id`
     * const workerProfileWithIdOnly = await prisma.workerProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkerProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkerProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkerProfile.
     * @param {WorkerProfileDeleteArgs} args - Arguments to delete one WorkerProfile.
     * @example
     * // Delete one WorkerProfile
     * const WorkerProfile = await prisma.workerProfile.delete({
     *   where: {
     *     // ... filter to delete one WorkerProfile
     *   }
     * })
     * 
     */
    delete<T extends WorkerProfileDeleteArgs>(args: SelectSubset<T, WorkerProfileDeleteArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkerProfile.
     * @param {WorkerProfileUpdateArgs} args - Arguments to update one WorkerProfile.
     * @example
     * // Update one WorkerProfile
     * const workerProfile = await prisma.workerProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkerProfileUpdateArgs>(args: SelectSubset<T, WorkerProfileUpdateArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkerProfiles.
     * @param {WorkerProfileDeleteManyArgs} args - Arguments to filter WorkerProfiles to delete.
     * @example
     * // Delete a few WorkerProfiles
     * const { count } = await prisma.workerProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkerProfileDeleteManyArgs>(args?: SelectSubset<T, WorkerProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkerProfiles
     * const workerProfile = await prisma.workerProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkerProfileUpdateManyArgs>(args: SelectSubset<T, WorkerProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkerProfiles and returns the data updated in the database.
     * @param {WorkerProfileUpdateManyAndReturnArgs} args - Arguments to update many WorkerProfiles.
     * @example
     * // Update many WorkerProfiles
     * const workerProfile = await prisma.workerProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkerProfiles and only return the `id`
     * const workerProfileWithIdOnly = await prisma.workerProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkerProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkerProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkerProfile.
     * @param {WorkerProfileUpsertArgs} args - Arguments to update or create a WorkerProfile.
     * @example
     * // Update or create a WorkerProfile
     * const workerProfile = await prisma.workerProfile.upsert({
     *   create: {
     *     // ... data to create a WorkerProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkerProfile we want to update
     *   }
     * })
     */
    upsert<T extends WorkerProfileUpsertArgs>(args: SelectSubset<T, WorkerProfileUpsertArgs<ExtArgs>>): Prisma__WorkerProfileClient<$Result.GetResult<Prisma.$WorkerProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerProfileCountArgs} args - Arguments to filter WorkerProfiles to count.
     * @example
     * // Count the number of WorkerProfiles
     * const count = await prisma.workerProfile.count({
     *   where: {
     *     // ... the filter for the WorkerProfiles we want to count
     *   }
     * })
    **/
    count<T extends WorkerProfileCountArgs>(
      args?: Subset<T, WorkerProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkerProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkerProfileAggregateArgs>(args: Subset<T, WorkerProfileAggregateArgs>): Prisma.PrismaPromise<GetWorkerProfileAggregateType<T>>

    /**
     * Group by WorkerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkerProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkerProfileGroupByArgs['orderBy'] }
        : { orderBy?: WorkerProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkerProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkerProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkerProfile model
   */
  readonly fields: WorkerProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkerProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkerProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkerProfile model
   */
  interface WorkerProfileFieldRefs {
    readonly id: FieldRef<"WorkerProfile", 'String'>
    readonly userId: FieldRef<"WorkerProfile", 'String'>
    readonly headline: FieldRef<"WorkerProfile", 'String'>
    readonly bio: FieldRef<"WorkerProfile", 'String'>
    readonly location: FieldRef<"WorkerProfile", 'String'>
    readonly phone: FieldRef<"WorkerProfile", 'String'>
    readonly skills: FieldRef<"WorkerProfile", 'String[]'>
    readonly profileSlug: FieldRef<"WorkerProfile", 'String'>
    readonly createdAt: FieldRef<"WorkerProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"WorkerProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkerProfile findUnique
   */
  export type WorkerProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * Filter, which WorkerProfile to fetch.
     */
    where: WorkerProfileWhereUniqueInput
  }

  /**
   * WorkerProfile findUniqueOrThrow
   */
  export type WorkerProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * Filter, which WorkerProfile to fetch.
     */
    where: WorkerProfileWhereUniqueInput
  }

  /**
   * WorkerProfile findFirst
   */
  export type WorkerProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * Filter, which WorkerProfile to fetch.
     */
    where?: WorkerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkerProfiles to fetch.
     */
    orderBy?: WorkerProfileOrderByWithRelationInput | WorkerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkerProfiles.
     */
    cursor?: WorkerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkerProfiles.
     */
    distinct?: WorkerProfileScalarFieldEnum | WorkerProfileScalarFieldEnum[]
  }

  /**
   * WorkerProfile findFirstOrThrow
   */
  export type WorkerProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * Filter, which WorkerProfile to fetch.
     */
    where?: WorkerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkerProfiles to fetch.
     */
    orderBy?: WorkerProfileOrderByWithRelationInput | WorkerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkerProfiles.
     */
    cursor?: WorkerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkerProfiles.
     */
    distinct?: WorkerProfileScalarFieldEnum | WorkerProfileScalarFieldEnum[]
  }

  /**
   * WorkerProfile findMany
   */
  export type WorkerProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * Filter, which WorkerProfiles to fetch.
     */
    where?: WorkerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkerProfiles to fetch.
     */
    orderBy?: WorkerProfileOrderByWithRelationInput | WorkerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkerProfiles.
     */
    cursor?: WorkerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkerProfiles.
     */
    skip?: number
    distinct?: WorkerProfileScalarFieldEnum | WorkerProfileScalarFieldEnum[]
  }

  /**
   * WorkerProfile create
   */
  export type WorkerProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkerProfile.
     */
    data: XOR<WorkerProfileCreateInput, WorkerProfileUncheckedCreateInput>
  }

  /**
   * WorkerProfile createMany
   */
  export type WorkerProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkerProfiles.
     */
    data: WorkerProfileCreateManyInput | WorkerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkerProfile createManyAndReturn
   */
  export type WorkerProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * The data used to create many WorkerProfiles.
     */
    data: WorkerProfileCreateManyInput | WorkerProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkerProfile update
   */
  export type WorkerProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkerProfile.
     */
    data: XOR<WorkerProfileUpdateInput, WorkerProfileUncheckedUpdateInput>
    /**
     * Choose, which WorkerProfile to update.
     */
    where: WorkerProfileWhereUniqueInput
  }

  /**
   * WorkerProfile updateMany
   */
  export type WorkerProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkerProfiles.
     */
    data: XOR<WorkerProfileUpdateManyMutationInput, WorkerProfileUncheckedUpdateManyInput>
    /**
     * Filter which WorkerProfiles to update
     */
    where?: WorkerProfileWhereInput
    /**
     * Limit how many WorkerProfiles to update.
     */
    limit?: number
  }

  /**
   * WorkerProfile updateManyAndReturn
   */
  export type WorkerProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * The data used to update WorkerProfiles.
     */
    data: XOR<WorkerProfileUpdateManyMutationInput, WorkerProfileUncheckedUpdateManyInput>
    /**
     * Filter which WorkerProfiles to update
     */
    where?: WorkerProfileWhereInput
    /**
     * Limit how many WorkerProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkerProfile upsert
   */
  export type WorkerProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkerProfile to update in case it exists.
     */
    where: WorkerProfileWhereUniqueInput
    /**
     * In case the WorkerProfile found by the `where` argument doesn't exist, create a new WorkerProfile with this data.
     */
    create: XOR<WorkerProfileCreateInput, WorkerProfileUncheckedCreateInput>
    /**
     * In case the WorkerProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkerProfileUpdateInput, WorkerProfileUncheckedUpdateInput>
  }

  /**
   * WorkerProfile delete
   */
  export type WorkerProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
    /**
     * Filter which WorkerProfile to delete.
     */
    where: WorkerProfileWhereUniqueInput
  }

  /**
   * WorkerProfile deleteMany
   */
  export type WorkerProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkerProfiles to delete
     */
    where?: WorkerProfileWhereInput
    /**
     * Limit how many WorkerProfiles to delete.
     */
    limit?: number
  }

  /**
   * WorkerProfile without action
   */
  export type WorkerProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerProfile
     */
    select?: WorkerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerProfile
     */
    omit?: WorkerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerProfileInclude<ExtArgs> | null
  }


  /**
   * Model Organisation
   */

  export type AggregateOrganisation = {
    _count: OrganisationCountAggregateOutputType | null
    _min: OrganisationMinAggregateOutputType | null
    _max: OrganisationMaxAggregateOutputType | null
  }

  export type OrganisationMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    name: string | null
    description: string | null
    website: string | null
    location: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganisationMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    name: string | null
    description: string | null
    website: string | null
    location: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganisationCountAggregateOutputType = {
    id: number
    ownerId: number
    name: number
    description: number
    website: number
    location: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrganisationMinAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    description?: true
    website?: true
    location?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganisationMaxAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    description?: true
    website?: true
    location?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganisationCountAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    description?: true
    website?: true
    location?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrganisationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organisation to aggregate.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organisations
    **/
    _count?: true | OrganisationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganisationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganisationMaxAggregateInputType
  }

  export type GetOrganisationAggregateType<T extends OrganisationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganisation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganisation[P]>
      : GetScalarType<T[P], AggregateOrganisation[P]>
  }




  export type OrganisationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganisationWhereInput
    orderBy?: OrganisationOrderByWithAggregationInput | OrganisationOrderByWithAggregationInput[]
    by: OrganisationScalarFieldEnum[] | OrganisationScalarFieldEnum
    having?: OrganisationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganisationCountAggregateInputType | true
    _min?: OrganisationMinAggregateInputType
    _max?: OrganisationMaxAggregateInputType
  }

  export type OrganisationGroupByOutputType = {
    id: string
    ownerId: string
    name: string
    description: string | null
    website: string | null
    location: string | null
    createdAt: Date
    updatedAt: Date
    _count: OrganisationCountAggregateOutputType | null
    _min: OrganisationMinAggregateOutputType | null
    _max: OrganisationMaxAggregateOutputType | null
  }

  type GetOrganisationGroupByPayload<T extends OrganisationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganisationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganisationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganisationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganisationGroupByOutputType[P]>
        }
      >
    >


  export type OrganisationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    name?: boolean
    description?: boolean
    website?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organisation"]>

  export type OrganisationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    name?: boolean
    description?: boolean
    website?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organisation"]>

  export type OrganisationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    name?: boolean
    description?: boolean
    website?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organisation"]>

  export type OrganisationSelectScalar = {
    id?: boolean
    ownerId?: boolean
    name?: boolean
    description?: boolean
    website?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrganisationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerId" | "name" | "description" | "website" | "location" | "createdAt" | "updatedAt", ExtArgs["result"]["organisation"]>
  export type OrganisationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrganisationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrganisationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OrganisationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organisation"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      name: string
      description: string | null
      website: string | null
      location: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["organisation"]>
    composites: {}
  }

  type OrganisationGetPayload<S extends boolean | null | undefined | OrganisationDefaultArgs> = $Result.GetResult<Prisma.$OrganisationPayload, S>

  type OrganisationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganisationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganisationCountAggregateInputType | true
    }

  export interface OrganisationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organisation'], meta: { name: 'Organisation' } }
    /**
     * Find zero or one Organisation that matches the filter.
     * @param {OrganisationFindUniqueArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganisationFindUniqueArgs>(args: SelectSubset<T, OrganisationFindUniqueArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organisation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganisationFindUniqueOrThrowArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganisationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganisationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organisation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindFirstArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganisationFindFirstArgs>(args?: SelectSubset<T, OrganisationFindFirstArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organisation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindFirstOrThrowArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganisationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganisationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organisations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organisations
     * const organisations = await prisma.organisation.findMany()
     * 
     * // Get first 10 Organisations
     * const organisations = await prisma.organisation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organisationWithIdOnly = await prisma.organisation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganisationFindManyArgs>(args?: SelectSubset<T, OrganisationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organisation.
     * @param {OrganisationCreateArgs} args - Arguments to create a Organisation.
     * @example
     * // Create one Organisation
     * const Organisation = await prisma.organisation.create({
     *   data: {
     *     // ... data to create a Organisation
     *   }
     * })
     * 
     */
    create<T extends OrganisationCreateArgs>(args: SelectSubset<T, OrganisationCreateArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organisations.
     * @param {OrganisationCreateManyArgs} args - Arguments to create many Organisations.
     * @example
     * // Create many Organisations
     * const organisation = await prisma.organisation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganisationCreateManyArgs>(args?: SelectSubset<T, OrganisationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organisations and returns the data saved in the database.
     * @param {OrganisationCreateManyAndReturnArgs} args - Arguments to create many Organisations.
     * @example
     * // Create many Organisations
     * const organisation = await prisma.organisation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organisations and only return the `id`
     * const organisationWithIdOnly = await prisma.organisation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganisationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganisationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organisation.
     * @param {OrganisationDeleteArgs} args - Arguments to delete one Organisation.
     * @example
     * // Delete one Organisation
     * const Organisation = await prisma.organisation.delete({
     *   where: {
     *     // ... filter to delete one Organisation
     *   }
     * })
     * 
     */
    delete<T extends OrganisationDeleteArgs>(args: SelectSubset<T, OrganisationDeleteArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organisation.
     * @param {OrganisationUpdateArgs} args - Arguments to update one Organisation.
     * @example
     * // Update one Organisation
     * const organisation = await prisma.organisation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganisationUpdateArgs>(args: SelectSubset<T, OrganisationUpdateArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organisations.
     * @param {OrganisationDeleteManyArgs} args - Arguments to filter Organisations to delete.
     * @example
     * // Delete a few Organisations
     * const { count } = await prisma.organisation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganisationDeleteManyArgs>(args?: SelectSubset<T, OrganisationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organisations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organisations
     * const organisation = await prisma.organisation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganisationUpdateManyArgs>(args: SelectSubset<T, OrganisationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organisations and returns the data updated in the database.
     * @param {OrganisationUpdateManyAndReturnArgs} args - Arguments to update many Organisations.
     * @example
     * // Update many Organisations
     * const organisation = await prisma.organisation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organisations and only return the `id`
     * const organisationWithIdOnly = await prisma.organisation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganisationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganisationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organisation.
     * @param {OrganisationUpsertArgs} args - Arguments to update or create a Organisation.
     * @example
     * // Update or create a Organisation
     * const organisation = await prisma.organisation.upsert({
     *   create: {
     *     // ... data to create a Organisation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organisation we want to update
     *   }
     * })
     */
    upsert<T extends OrganisationUpsertArgs>(args: SelectSubset<T, OrganisationUpsertArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organisations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationCountArgs} args - Arguments to filter Organisations to count.
     * @example
     * // Count the number of Organisations
     * const count = await prisma.organisation.count({
     *   where: {
     *     // ... the filter for the Organisations we want to count
     *   }
     * })
    **/
    count<T extends OrganisationCountArgs>(
      args?: Subset<T, OrganisationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganisationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organisation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganisationAggregateArgs>(args: Subset<T, OrganisationAggregateArgs>): Prisma.PrismaPromise<GetOrganisationAggregateType<T>>

    /**
     * Group by Organisation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganisationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganisationGroupByArgs['orderBy'] }
        : { orderBy?: OrganisationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganisationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganisationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organisation model
   */
  readonly fields: OrganisationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organisation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganisationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organisation model
   */
  interface OrganisationFieldRefs {
    readonly id: FieldRef<"Organisation", 'String'>
    readonly ownerId: FieldRef<"Organisation", 'String'>
    readonly name: FieldRef<"Organisation", 'String'>
    readonly description: FieldRef<"Organisation", 'String'>
    readonly website: FieldRef<"Organisation", 'String'>
    readonly location: FieldRef<"Organisation", 'String'>
    readonly createdAt: FieldRef<"Organisation", 'DateTime'>
    readonly updatedAt: FieldRef<"Organisation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organisation findUnique
   */
  export type OrganisationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation findUniqueOrThrow
   */
  export type OrganisationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation findFirst
   */
  export type OrganisationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organisations.
     */
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation findFirstOrThrow
   */
  export type OrganisationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organisations.
     */
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation findMany
   */
  export type OrganisationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisations to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation create
   */
  export type OrganisationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organisation.
     */
    data: XOR<OrganisationCreateInput, OrganisationUncheckedCreateInput>
  }

  /**
   * Organisation createMany
   */
  export type OrganisationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organisations.
     */
    data: OrganisationCreateManyInput | OrganisationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organisation createManyAndReturn
   */
  export type OrganisationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * The data used to create many Organisations.
     */
    data: OrganisationCreateManyInput | OrganisationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Organisation update
   */
  export type OrganisationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organisation.
     */
    data: XOR<OrganisationUpdateInput, OrganisationUncheckedUpdateInput>
    /**
     * Choose, which Organisation to update.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation updateMany
   */
  export type OrganisationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organisations.
     */
    data: XOR<OrganisationUpdateManyMutationInput, OrganisationUncheckedUpdateManyInput>
    /**
     * Filter which Organisations to update
     */
    where?: OrganisationWhereInput
    /**
     * Limit how many Organisations to update.
     */
    limit?: number
  }

  /**
   * Organisation updateManyAndReturn
   */
  export type OrganisationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * The data used to update Organisations.
     */
    data: XOR<OrganisationUpdateManyMutationInput, OrganisationUncheckedUpdateManyInput>
    /**
     * Filter which Organisations to update
     */
    where?: OrganisationWhereInput
    /**
     * Limit how many Organisations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Organisation upsert
   */
  export type OrganisationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organisation to update in case it exists.
     */
    where: OrganisationWhereUniqueInput
    /**
     * In case the Organisation found by the `where` argument doesn't exist, create a new Organisation with this data.
     */
    create: XOR<OrganisationCreateInput, OrganisationUncheckedCreateInput>
    /**
     * In case the Organisation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganisationUpdateInput, OrganisationUncheckedUpdateInput>
  }

  /**
   * Organisation delete
   */
  export type OrganisationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter which Organisation to delete.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation deleteMany
   */
  export type OrganisationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organisations to delete
     */
    where?: OrganisationWhereInput
    /**
     * Limit how many Organisations to delete.
     */
    limit?: number
  }

  /**
   * Organisation without action
   */
  export type OrganisationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
  }


  /**
   * Model WorkReceipt
   */

  export type AggregateWorkReceipt = {
    _count: WorkReceiptCountAggregateOutputType | null
    _avg: WorkReceiptAvgAggregateOutputType | null
    _sum: WorkReceiptSumAggregateOutputType | null
    _min: WorkReceiptMinAggregateOutputType | null
    _max: WorkReceiptMaxAggregateOutputType | null
  }

  export type WorkReceiptAvgAggregateOutputType = {
    durationMinutes: number | null
    amount: Decimal | null
  }

  export type WorkReceiptSumAggregateOutputType = {
    durationMinutes: number | null
    amount: Decimal | null
  }

  export type WorkReceiptMinAggregateOutputType = {
    id: string | null
    receiptNumber: string | null
    workerId: string | null
    customerName: string | null
    customerEmail: string | null
    customerPhone: string | null
    serviceTitle: string | null
    description: string | null
    workDate: Date | null
    durationMinutes: number | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.ReceiptStatus | null
    visibility: $Enums.Visibility | null
    verificationCode: string | null
    integrityHash: string | null
    submittedAt: Date | null
    verifiedAt: Date | null
    lockedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkReceiptMaxAggregateOutputType = {
    id: string | null
    receiptNumber: string | null
    workerId: string | null
    customerName: string | null
    customerEmail: string | null
    customerPhone: string | null
    serviceTitle: string | null
    description: string | null
    workDate: Date | null
    durationMinutes: number | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.ReceiptStatus | null
    visibility: $Enums.Visibility | null
    verificationCode: string | null
    integrityHash: string | null
    submittedAt: Date | null
    verifiedAt: Date | null
    lockedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkReceiptCountAggregateOutputType = {
    id: number
    receiptNumber: number
    workerId: number
    customerName: number
    customerEmail: number
    customerPhone: number
    serviceTitle: number
    description: number
    workDate: number
    durationMinutes: number
    amount: number
    currency: number
    skillsDemonstrated: number
    status: number
    visibility: number
    verificationCode: number
    integrityHash: number
    submittedAt: number
    verifiedAt: number
    lockedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkReceiptAvgAggregateInputType = {
    durationMinutes?: true
    amount?: true
  }

  export type WorkReceiptSumAggregateInputType = {
    durationMinutes?: true
    amount?: true
  }

  export type WorkReceiptMinAggregateInputType = {
    id?: true
    receiptNumber?: true
    workerId?: true
    customerName?: true
    customerEmail?: true
    customerPhone?: true
    serviceTitle?: true
    description?: true
    workDate?: true
    durationMinutes?: true
    amount?: true
    currency?: true
    status?: true
    visibility?: true
    verificationCode?: true
    integrityHash?: true
    submittedAt?: true
    verifiedAt?: true
    lockedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkReceiptMaxAggregateInputType = {
    id?: true
    receiptNumber?: true
    workerId?: true
    customerName?: true
    customerEmail?: true
    customerPhone?: true
    serviceTitle?: true
    description?: true
    workDate?: true
    durationMinutes?: true
    amount?: true
    currency?: true
    status?: true
    visibility?: true
    verificationCode?: true
    integrityHash?: true
    submittedAt?: true
    verifiedAt?: true
    lockedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkReceiptCountAggregateInputType = {
    id?: true
    receiptNumber?: true
    workerId?: true
    customerName?: true
    customerEmail?: true
    customerPhone?: true
    serviceTitle?: true
    description?: true
    workDate?: true
    durationMinutes?: true
    amount?: true
    currency?: true
    skillsDemonstrated?: true
    status?: true
    visibility?: true
    verificationCode?: true
    integrityHash?: true
    submittedAt?: true
    verifiedAt?: true
    lockedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkReceiptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkReceipt to aggregate.
     */
    where?: WorkReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkReceipts to fetch.
     */
    orderBy?: WorkReceiptOrderByWithRelationInput | WorkReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkReceipts
    **/
    _count?: true | WorkReceiptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorkReceiptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorkReceiptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkReceiptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkReceiptMaxAggregateInputType
  }

  export type GetWorkReceiptAggregateType<T extends WorkReceiptAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkReceipt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkReceipt[P]>
      : GetScalarType<T[P], AggregateWorkReceipt[P]>
  }




  export type WorkReceiptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkReceiptWhereInput
    orderBy?: WorkReceiptOrderByWithAggregationInput | WorkReceiptOrderByWithAggregationInput[]
    by: WorkReceiptScalarFieldEnum[] | WorkReceiptScalarFieldEnum
    having?: WorkReceiptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkReceiptCountAggregateInputType | true
    _avg?: WorkReceiptAvgAggregateInputType
    _sum?: WorkReceiptSumAggregateInputType
    _min?: WorkReceiptMinAggregateInputType
    _max?: WorkReceiptMaxAggregateInputType
  }

  export type WorkReceiptGroupByOutputType = {
    id: string
    receiptNumber: string | null
    workerId: string
    customerName: string
    customerEmail: string
    customerPhone: string | null
    serviceTitle: string
    description: string
    workDate: Date
    durationMinutes: number | null
    amount: Decimal | null
    currency: string
    skillsDemonstrated: string[]
    status: $Enums.ReceiptStatus
    visibility: $Enums.Visibility
    verificationCode: string | null
    integrityHash: string | null
    submittedAt: Date | null
    verifiedAt: Date | null
    lockedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: WorkReceiptCountAggregateOutputType | null
    _avg: WorkReceiptAvgAggregateOutputType | null
    _sum: WorkReceiptSumAggregateOutputType | null
    _min: WorkReceiptMinAggregateOutputType | null
    _max: WorkReceiptMaxAggregateOutputType | null
  }

  type GetWorkReceiptGroupByPayload<T extends WorkReceiptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkReceiptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkReceiptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkReceiptGroupByOutputType[P]>
            : GetScalarType<T[P], WorkReceiptGroupByOutputType[P]>
        }
      >
    >


  export type WorkReceiptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptNumber?: boolean
    workerId?: boolean
    customerName?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    serviceTitle?: boolean
    description?: boolean
    workDate?: boolean
    durationMinutes?: boolean
    amount?: boolean
    currency?: boolean
    skillsDemonstrated?: boolean
    status?: boolean
    visibility?: boolean
    verificationCode?: boolean
    integrityHash?: boolean
    submittedAt?: boolean
    verifiedAt?: boolean
    lockedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    worker?: boolean | UserDefaultArgs<ExtArgs>
    evidence?: boolean | WorkReceipt$evidenceArgs<ExtArgs>
    verificationRequest?: boolean | WorkReceipt$verificationRequestArgs<ExtArgs>
    confirmation?: boolean | WorkReceipt$confirmationArgs<ExtArgs>
    dispute?: boolean | WorkReceipt$disputeArgs<ExtArgs>
    auditLogs?: boolean | WorkReceipt$auditLogsArgs<ExtArgs>
    _count?: boolean | WorkReceiptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workReceipt"]>

  export type WorkReceiptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptNumber?: boolean
    workerId?: boolean
    customerName?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    serviceTitle?: boolean
    description?: boolean
    workDate?: boolean
    durationMinutes?: boolean
    amount?: boolean
    currency?: boolean
    skillsDemonstrated?: boolean
    status?: boolean
    visibility?: boolean
    verificationCode?: boolean
    integrityHash?: boolean
    submittedAt?: boolean
    verifiedAt?: boolean
    lockedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    worker?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workReceipt"]>

  export type WorkReceiptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptNumber?: boolean
    workerId?: boolean
    customerName?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    serviceTitle?: boolean
    description?: boolean
    workDate?: boolean
    durationMinutes?: boolean
    amount?: boolean
    currency?: boolean
    skillsDemonstrated?: boolean
    status?: boolean
    visibility?: boolean
    verificationCode?: boolean
    integrityHash?: boolean
    submittedAt?: boolean
    verifiedAt?: boolean
    lockedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    worker?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workReceipt"]>

  export type WorkReceiptSelectScalar = {
    id?: boolean
    receiptNumber?: boolean
    workerId?: boolean
    customerName?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    serviceTitle?: boolean
    description?: boolean
    workDate?: boolean
    durationMinutes?: boolean
    amount?: boolean
    currency?: boolean
    skillsDemonstrated?: boolean
    status?: boolean
    visibility?: boolean
    verificationCode?: boolean
    integrityHash?: boolean
    submittedAt?: boolean
    verifiedAt?: boolean
    lockedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkReceiptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "receiptNumber" | "workerId" | "customerName" | "customerEmail" | "customerPhone" | "serviceTitle" | "description" | "workDate" | "durationMinutes" | "amount" | "currency" | "skillsDemonstrated" | "status" | "visibility" | "verificationCode" | "integrityHash" | "submittedAt" | "verifiedAt" | "lockedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["workReceipt"]>
  export type WorkReceiptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worker?: boolean | UserDefaultArgs<ExtArgs>
    evidence?: boolean | WorkReceipt$evidenceArgs<ExtArgs>
    verificationRequest?: boolean | WorkReceipt$verificationRequestArgs<ExtArgs>
    confirmation?: boolean | WorkReceipt$confirmationArgs<ExtArgs>
    dispute?: boolean | WorkReceipt$disputeArgs<ExtArgs>
    auditLogs?: boolean | WorkReceipt$auditLogsArgs<ExtArgs>
    _count?: boolean | WorkReceiptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkReceiptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worker?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WorkReceiptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worker?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WorkReceiptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkReceipt"
    objects: {
      worker: Prisma.$UserPayload<ExtArgs>
      evidence: Prisma.$EvidencePayload<ExtArgs>[]
      verificationRequest: Prisma.$VerificationRequestPayload<ExtArgs> | null
      confirmation: Prisma.$ConfirmationPayload<ExtArgs> | null
      dispute: Prisma.$DisputePayload<ExtArgs> | null
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      receiptNumber: string | null
      workerId: string
      customerName: string
      customerEmail: string
      customerPhone: string | null
      serviceTitle: string
      description: string
      workDate: Date
      durationMinutes: number | null
      amount: Prisma.Decimal | null
      currency: string
      skillsDemonstrated: string[]
      status: $Enums.ReceiptStatus
      visibility: $Enums.Visibility
      verificationCode: string | null
      integrityHash: string | null
      submittedAt: Date | null
      verifiedAt: Date | null
      lockedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workReceipt"]>
    composites: {}
  }

  type WorkReceiptGetPayload<S extends boolean | null | undefined | WorkReceiptDefaultArgs> = $Result.GetResult<Prisma.$WorkReceiptPayload, S>

  type WorkReceiptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkReceiptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkReceiptCountAggregateInputType | true
    }

  export interface WorkReceiptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkReceipt'], meta: { name: 'WorkReceipt' } }
    /**
     * Find zero or one WorkReceipt that matches the filter.
     * @param {WorkReceiptFindUniqueArgs} args - Arguments to find a WorkReceipt
     * @example
     * // Get one WorkReceipt
     * const workReceipt = await prisma.workReceipt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkReceiptFindUniqueArgs>(args: SelectSubset<T, WorkReceiptFindUniqueArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkReceipt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkReceiptFindUniqueOrThrowArgs} args - Arguments to find a WorkReceipt
     * @example
     * // Get one WorkReceipt
     * const workReceipt = await prisma.workReceipt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkReceiptFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkReceiptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkReceipt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkReceiptFindFirstArgs} args - Arguments to find a WorkReceipt
     * @example
     * // Get one WorkReceipt
     * const workReceipt = await prisma.workReceipt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkReceiptFindFirstArgs>(args?: SelectSubset<T, WorkReceiptFindFirstArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkReceipt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkReceiptFindFirstOrThrowArgs} args - Arguments to find a WorkReceipt
     * @example
     * // Get one WorkReceipt
     * const workReceipt = await prisma.workReceipt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkReceiptFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkReceiptFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkReceipts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkReceiptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkReceipts
     * const workReceipts = await prisma.workReceipt.findMany()
     * 
     * // Get first 10 WorkReceipts
     * const workReceipts = await prisma.workReceipt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workReceiptWithIdOnly = await prisma.workReceipt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkReceiptFindManyArgs>(args?: SelectSubset<T, WorkReceiptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkReceipt.
     * @param {WorkReceiptCreateArgs} args - Arguments to create a WorkReceipt.
     * @example
     * // Create one WorkReceipt
     * const WorkReceipt = await prisma.workReceipt.create({
     *   data: {
     *     // ... data to create a WorkReceipt
     *   }
     * })
     * 
     */
    create<T extends WorkReceiptCreateArgs>(args: SelectSubset<T, WorkReceiptCreateArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkReceipts.
     * @param {WorkReceiptCreateManyArgs} args - Arguments to create many WorkReceipts.
     * @example
     * // Create many WorkReceipts
     * const workReceipt = await prisma.workReceipt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkReceiptCreateManyArgs>(args?: SelectSubset<T, WorkReceiptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkReceipts and returns the data saved in the database.
     * @param {WorkReceiptCreateManyAndReturnArgs} args - Arguments to create many WorkReceipts.
     * @example
     * // Create many WorkReceipts
     * const workReceipt = await prisma.workReceipt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkReceipts and only return the `id`
     * const workReceiptWithIdOnly = await prisma.workReceipt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkReceiptCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkReceiptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkReceipt.
     * @param {WorkReceiptDeleteArgs} args - Arguments to delete one WorkReceipt.
     * @example
     * // Delete one WorkReceipt
     * const WorkReceipt = await prisma.workReceipt.delete({
     *   where: {
     *     // ... filter to delete one WorkReceipt
     *   }
     * })
     * 
     */
    delete<T extends WorkReceiptDeleteArgs>(args: SelectSubset<T, WorkReceiptDeleteArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkReceipt.
     * @param {WorkReceiptUpdateArgs} args - Arguments to update one WorkReceipt.
     * @example
     * // Update one WorkReceipt
     * const workReceipt = await prisma.workReceipt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkReceiptUpdateArgs>(args: SelectSubset<T, WorkReceiptUpdateArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkReceipts.
     * @param {WorkReceiptDeleteManyArgs} args - Arguments to filter WorkReceipts to delete.
     * @example
     * // Delete a few WorkReceipts
     * const { count } = await prisma.workReceipt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkReceiptDeleteManyArgs>(args?: SelectSubset<T, WorkReceiptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkReceipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkReceiptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkReceipts
     * const workReceipt = await prisma.workReceipt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkReceiptUpdateManyArgs>(args: SelectSubset<T, WorkReceiptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkReceipts and returns the data updated in the database.
     * @param {WorkReceiptUpdateManyAndReturnArgs} args - Arguments to update many WorkReceipts.
     * @example
     * // Update many WorkReceipts
     * const workReceipt = await prisma.workReceipt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkReceipts and only return the `id`
     * const workReceiptWithIdOnly = await prisma.workReceipt.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkReceiptUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkReceiptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkReceipt.
     * @param {WorkReceiptUpsertArgs} args - Arguments to update or create a WorkReceipt.
     * @example
     * // Update or create a WorkReceipt
     * const workReceipt = await prisma.workReceipt.upsert({
     *   create: {
     *     // ... data to create a WorkReceipt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkReceipt we want to update
     *   }
     * })
     */
    upsert<T extends WorkReceiptUpsertArgs>(args: SelectSubset<T, WorkReceiptUpsertArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkReceipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkReceiptCountArgs} args - Arguments to filter WorkReceipts to count.
     * @example
     * // Count the number of WorkReceipts
     * const count = await prisma.workReceipt.count({
     *   where: {
     *     // ... the filter for the WorkReceipts we want to count
     *   }
     * })
    **/
    count<T extends WorkReceiptCountArgs>(
      args?: Subset<T, WorkReceiptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkReceiptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkReceipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkReceiptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkReceiptAggregateArgs>(args: Subset<T, WorkReceiptAggregateArgs>): Prisma.PrismaPromise<GetWorkReceiptAggregateType<T>>

    /**
     * Group by WorkReceipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkReceiptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkReceiptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkReceiptGroupByArgs['orderBy'] }
        : { orderBy?: WorkReceiptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkReceiptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkReceiptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkReceipt model
   */
  readonly fields: WorkReceiptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkReceipt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkReceiptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    worker<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    evidence<T extends WorkReceipt$evidenceArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceipt$evidenceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    verificationRequest<T extends WorkReceipt$verificationRequestArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceipt$verificationRequestArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    confirmation<T extends WorkReceipt$confirmationArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceipt$confirmationArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    dispute<T extends WorkReceipt$disputeArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceipt$disputeArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    auditLogs<T extends WorkReceipt$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceipt$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkReceipt model
   */
  interface WorkReceiptFieldRefs {
    readonly id: FieldRef<"WorkReceipt", 'String'>
    readonly receiptNumber: FieldRef<"WorkReceipt", 'String'>
    readonly workerId: FieldRef<"WorkReceipt", 'String'>
    readonly customerName: FieldRef<"WorkReceipt", 'String'>
    readonly customerEmail: FieldRef<"WorkReceipt", 'String'>
    readonly customerPhone: FieldRef<"WorkReceipt", 'String'>
    readonly serviceTitle: FieldRef<"WorkReceipt", 'String'>
    readonly description: FieldRef<"WorkReceipt", 'String'>
    readonly workDate: FieldRef<"WorkReceipt", 'DateTime'>
    readonly durationMinutes: FieldRef<"WorkReceipt", 'Int'>
    readonly amount: FieldRef<"WorkReceipt", 'Decimal'>
    readonly currency: FieldRef<"WorkReceipt", 'String'>
    readonly skillsDemonstrated: FieldRef<"WorkReceipt", 'String[]'>
    readonly status: FieldRef<"WorkReceipt", 'ReceiptStatus'>
    readonly visibility: FieldRef<"WorkReceipt", 'Visibility'>
    readonly verificationCode: FieldRef<"WorkReceipt", 'String'>
    readonly integrityHash: FieldRef<"WorkReceipt", 'String'>
    readonly submittedAt: FieldRef<"WorkReceipt", 'DateTime'>
    readonly verifiedAt: FieldRef<"WorkReceipt", 'DateTime'>
    readonly lockedAt: FieldRef<"WorkReceipt", 'DateTime'>
    readonly createdAt: FieldRef<"WorkReceipt", 'DateTime'>
    readonly updatedAt: FieldRef<"WorkReceipt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkReceipt findUnique
   */
  export type WorkReceiptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * Filter, which WorkReceipt to fetch.
     */
    where: WorkReceiptWhereUniqueInput
  }

  /**
   * WorkReceipt findUniqueOrThrow
   */
  export type WorkReceiptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * Filter, which WorkReceipt to fetch.
     */
    where: WorkReceiptWhereUniqueInput
  }

  /**
   * WorkReceipt findFirst
   */
  export type WorkReceiptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * Filter, which WorkReceipt to fetch.
     */
    where?: WorkReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkReceipts to fetch.
     */
    orderBy?: WorkReceiptOrderByWithRelationInput | WorkReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkReceipts.
     */
    cursor?: WorkReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkReceipts.
     */
    distinct?: WorkReceiptScalarFieldEnum | WorkReceiptScalarFieldEnum[]
  }

  /**
   * WorkReceipt findFirstOrThrow
   */
  export type WorkReceiptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * Filter, which WorkReceipt to fetch.
     */
    where?: WorkReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkReceipts to fetch.
     */
    orderBy?: WorkReceiptOrderByWithRelationInput | WorkReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkReceipts.
     */
    cursor?: WorkReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkReceipts.
     */
    distinct?: WorkReceiptScalarFieldEnum | WorkReceiptScalarFieldEnum[]
  }

  /**
   * WorkReceipt findMany
   */
  export type WorkReceiptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * Filter, which WorkReceipts to fetch.
     */
    where?: WorkReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkReceipts to fetch.
     */
    orderBy?: WorkReceiptOrderByWithRelationInput | WorkReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkReceipts.
     */
    cursor?: WorkReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkReceipts.
     */
    skip?: number
    distinct?: WorkReceiptScalarFieldEnum | WorkReceiptScalarFieldEnum[]
  }

  /**
   * WorkReceipt create
   */
  export type WorkReceiptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkReceipt.
     */
    data: XOR<WorkReceiptCreateInput, WorkReceiptUncheckedCreateInput>
  }

  /**
   * WorkReceipt createMany
   */
  export type WorkReceiptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkReceipts.
     */
    data: WorkReceiptCreateManyInput | WorkReceiptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkReceipt createManyAndReturn
   */
  export type WorkReceiptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * The data used to create many WorkReceipts.
     */
    data: WorkReceiptCreateManyInput | WorkReceiptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkReceipt update
   */
  export type WorkReceiptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkReceipt.
     */
    data: XOR<WorkReceiptUpdateInput, WorkReceiptUncheckedUpdateInput>
    /**
     * Choose, which WorkReceipt to update.
     */
    where: WorkReceiptWhereUniqueInput
  }

  /**
   * WorkReceipt updateMany
   */
  export type WorkReceiptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkReceipts.
     */
    data: XOR<WorkReceiptUpdateManyMutationInput, WorkReceiptUncheckedUpdateManyInput>
    /**
     * Filter which WorkReceipts to update
     */
    where?: WorkReceiptWhereInput
    /**
     * Limit how many WorkReceipts to update.
     */
    limit?: number
  }

  /**
   * WorkReceipt updateManyAndReturn
   */
  export type WorkReceiptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * The data used to update WorkReceipts.
     */
    data: XOR<WorkReceiptUpdateManyMutationInput, WorkReceiptUncheckedUpdateManyInput>
    /**
     * Filter which WorkReceipts to update
     */
    where?: WorkReceiptWhereInput
    /**
     * Limit how many WorkReceipts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkReceipt upsert
   */
  export type WorkReceiptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkReceipt to update in case it exists.
     */
    where: WorkReceiptWhereUniqueInput
    /**
     * In case the WorkReceipt found by the `where` argument doesn't exist, create a new WorkReceipt with this data.
     */
    create: XOR<WorkReceiptCreateInput, WorkReceiptUncheckedCreateInput>
    /**
     * In case the WorkReceipt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkReceiptUpdateInput, WorkReceiptUncheckedUpdateInput>
  }

  /**
   * WorkReceipt delete
   */
  export type WorkReceiptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    /**
     * Filter which WorkReceipt to delete.
     */
    where: WorkReceiptWhereUniqueInput
  }

  /**
   * WorkReceipt deleteMany
   */
  export type WorkReceiptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkReceipts to delete
     */
    where?: WorkReceiptWhereInput
    /**
     * Limit how many WorkReceipts to delete.
     */
    limit?: number
  }

  /**
   * WorkReceipt.evidence
   */
  export type WorkReceipt$evidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    where?: EvidenceWhereInput
    orderBy?: EvidenceOrderByWithRelationInput | EvidenceOrderByWithRelationInput[]
    cursor?: EvidenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EvidenceScalarFieldEnum | EvidenceScalarFieldEnum[]
  }

  /**
   * WorkReceipt.verificationRequest
   */
  export type WorkReceipt$verificationRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    where?: VerificationRequestWhereInput
  }

  /**
   * WorkReceipt.confirmation
   */
  export type WorkReceipt$confirmationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    where?: ConfirmationWhereInput
  }

  /**
   * WorkReceipt.dispute
   */
  export type WorkReceipt$disputeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    where?: DisputeWhereInput
  }

  /**
   * WorkReceipt.auditLogs
   */
  export type WorkReceipt$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * WorkReceipt without action
   */
  export type WorkReceiptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
  }


  /**
   * Model Evidence
   */

  export type AggregateEvidence = {
    _count: EvidenceCountAggregateOutputType | null
    _avg: EvidenceAvgAggregateOutputType | null
    _sum: EvidenceSumAggregateOutputType | null
    _min: EvidenceMinAggregateOutputType | null
    _max: EvidenceMaxAggregateOutputType | null
  }

  export type EvidenceAvgAggregateOutputType = {
    size: number | null
  }

  export type EvidenceSumAggregateOutputType = {
    size: number | null
  }

  export type EvidenceMinAggregateOutputType = {
    id: string | null
    receiptId: string | null
    type: $Enums.EvidenceType | null
    url: string | null
    originalFilename: string | null
    mimeType: string | null
    size: number | null
    description: string | null
    createdAt: Date | null
  }

  export type EvidenceMaxAggregateOutputType = {
    id: string | null
    receiptId: string | null
    type: $Enums.EvidenceType | null
    url: string | null
    originalFilename: string | null
    mimeType: string | null
    size: number | null
    description: string | null
    createdAt: Date | null
  }

  export type EvidenceCountAggregateOutputType = {
    id: number
    receiptId: number
    type: number
    url: number
    originalFilename: number
    mimeType: number
    size: number
    description: number
    createdAt: number
    _all: number
  }


  export type EvidenceAvgAggregateInputType = {
    size?: true
  }

  export type EvidenceSumAggregateInputType = {
    size?: true
  }

  export type EvidenceMinAggregateInputType = {
    id?: true
    receiptId?: true
    type?: true
    url?: true
    originalFilename?: true
    mimeType?: true
    size?: true
    description?: true
    createdAt?: true
  }

  export type EvidenceMaxAggregateInputType = {
    id?: true
    receiptId?: true
    type?: true
    url?: true
    originalFilename?: true
    mimeType?: true
    size?: true
    description?: true
    createdAt?: true
  }

  export type EvidenceCountAggregateInputType = {
    id?: true
    receiptId?: true
    type?: true
    url?: true
    originalFilename?: true
    mimeType?: true
    size?: true
    description?: true
    createdAt?: true
    _all?: true
  }

  export type EvidenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Evidence to aggregate.
     */
    where?: EvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Evidences to fetch.
     */
    orderBy?: EvidenceOrderByWithRelationInput | EvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Evidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Evidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Evidences
    **/
    _count?: true | EvidenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EvidenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EvidenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EvidenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EvidenceMaxAggregateInputType
  }

  export type GetEvidenceAggregateType<T extends EvidenceAggregateArgs> = {
        [P in keyof T & keyof AggregateEvidence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvidence[P]>
      : GetScalarType<T[P], AggregateEvidence[P]>
  }




  export type EvidenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvidenceWhereInput
    orderBy?: EvidenceOrderByWithAggregationInput | EvidenceOrderByWithAggregationInput[]
    by: EvidenceScalarFieldEnum[] | EvidenceScalarFieldEnum
    having?: EvidenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EvidenceCountAggregateInputType | true
    _avg?: EvidenceAvgAggregateInputType
    _sum?: EvidenceSumAggregateInputType
    _min?: EvidenceMinAggregateInputType
    _max?: EvidenceMaxAggregateInputType
  }

  export type EvidenceGroupByOutputType = {
    id: string
    receiptId: string
    type: $Enums.EvidenceType
    url: string
    originalFilename: string | null
    mimeType: string | null
    size: number | null
    description: string | null
    createdAt: Date
    _count: EvidenceCountAggregateOutputType | null
    _avg: EvidenceAvgAggregateOutputType | null
    _sum: EvidenceSumAggregateOutputType | null
    _min: EvidenceMinAggregateOutputType | null
    _max: EvidenceMaxAggregateOutputType | null
  }

  type GetEvidenceGroupByPayload<T extends EvidenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EvidenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EvidenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EvidenceGroupByOutputType[P]>
            : GetScalarType<T[P], EvidenceGroupByOutputType[P]>
        }
      >
    >


  export type EvidenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    type?: boolean
    url?: boolean
    originalFilename?: boolean
    mimeType?: boolean
    size?: boolean
    description?: boolean
    createdAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidence"]>

  export type EvidenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    type?: boolean
    url?: boolean
    originalFilename?: boolean
    mimeType?: boolean
    size?: boolean
    description?: boolean
    createdAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidence"]>

  export type EvidenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    type?: boolean
    url?: boolean
    originalFilename?: boolean
    mimeType?: boolean
    size?: boolean
    description?: boolean
    createdAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidence"]>

  export type EvidenceSelectScalar = {
    id?: boolean
    receiptId?: boolean
    type?: boolean
    url?: boolean
    originalFilename?: boolean
    mimeType?: boolean
    size?: boolean
    description?: boolean
    createdAt?: boolean
  }

  export type EvidenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "receiptId" | "type" | "url" | "originalFilename" | "mimeType" | "size" | "description" | "createdAt", ExtArgs["result"]["evidence"]>
  export type EvidenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }
  export type EvidenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }
  export type EvidenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }

  export type $EvidencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Evidence"
    objects: {
      receipt: Prisma.$WorkReceiptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      receiptId: string
      type: $Enums.EvidenceType
      url: string
      originalFilename: string | null
      mimeType: string | null
      size: number | null
      description: string | null
      createdAt: Date
    }, ExtArgs["result"]["evidence"]>
    composites: {}
  }

  type EvidenceGetPayload<S extends boolean | null | undefined | EvidenceDefaultArgs> = $Result.GetResult<Prisma.$EvidencePayload, S>

  type EvidenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EvidenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EvidenceCountAggregateInputType | true
    }

  export interface EvidenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Evidence'], meta: { name: 'Evidence' } }
    /**
     * Find zero or one Evidence that matches the filter.
     * @param {EvidenceFindUniqueArgs} args - Arguments to find a Evidence
     * @example
     * // Get one Evidence
     * const evidence = await prisma.evidence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EvidenceFindUniqueArgs>(args: SelectSubset<T, EvidenceFindUniqueArgs<ExtArgs>>): Prisma__EvidenceClient<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Evidence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EvidenceFindUniqueOrThrowArgs} args - Arguments to find a Evidence
     * @example
     * // Get one Evidence
     * const evidence = await prisma.evidence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EvidenceFindUniqueOrThrowArgs>(args: SelectSubset<T, EvidenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EvidenceClient<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Evidence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceFindFirstArgs} args - Arguments to find a Evidence
     * @example
     * // Get one Evidence
     * const evidence = await prisma.evidence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EvidenceFindFirstArgs>(args?: SelectSubset<T, EvidenceFindFirstArgs<ExtArgs>>): Prisma__EvidenceClient<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Evidence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceFindFirstOrThrowArgs} args - Arguments to find a Evidence
     * @example
     * // Get one Evidence
     * const evidence = await prisma.evidence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EvidenceFindFirstOrThrowArgs>(args?: SelectSubset<T, EvidenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__EvidenceClient<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Evidences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Evidences
     * const evidences = await prisma.evidence.findMany()
     * 
     * // Get first 10 Evidences
     * const evidences = await prisma.evidence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const evidenceWithIdOnly = await prisma.evidence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EvidenceFindManyArgs>(args?: SelectSubset<T, EvidenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Evidence.
     * @param {EvidenceCreateArgs} args - Arguments to create a Evidence.
     * @example
     * // Create one Evidence
     * const Evidence = await prisma.evidence.create({
     *   data: {
     *     // ... data to create a Evidence
     *   }
     * })
     * 
     */
    create<T extends EvidenceCreateArgs>(args: SelectSubset<T, EvidenceCreateArgs<ExtArgs>>): Prisma__EvidenceClient<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Evidences.
     * @param {EvidenceCreateManyArgs} args - Arguments to create many Evidences.
     * @example
     * // Create many Evidences
     * const evidence = await prisma.evidence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EvidenceCreateManyArgs>(args?: SelectSubset<T, EvidenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Evidences and returns the data saved in the database.
     * @param {EvidenceCreateManyAndReturnArgs} args - Arguments to create many Evidences.
     * @example
     * // Create many Evidences
     * const evidence = await prisma.evidence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Evidences and only return the `id`
     * const evidenceWithIdOnly = await prisma.evidence.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EvidenceCreateManyAndReturnArgs>(args?: SelectSubset<T, EvidenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Evidence.
     * @param {EvidenceDeleteArgs} args - Arguments to delete one Evidence.
     * @example
     * // Delete one Evidence
     * const Evidence = await prisma.evidence.delete({
     *   where: {
     *     // ... filter to delete one Evidence
     *   }
     * })
     * 
     */
    delete<T extends EvidenceDeleteArgs>(args: SelectSubset<T, EvidenceDeleteArgs<ExtArgs>>): Prisma__EvidenceClient<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Evidence.
     * @param {EvidenceUpdateArgs} args - Arguments to update one Evidence.
     * @example
     * // Update one Evidence
     * const evidence = await prisma.evidence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EvidenceUpdateArgs>(args: SelectSubset<T, EvidenceUpdateArgs<ExtArgs>>): Prisma__EvidenceClient<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Evidences.
     * @param {EvidenceDeleteManyArgs} args - Arguments to filter Evidences to delete.
     * @example
     * // Delete a few Evidences
     * const { count } = await prisma.evidence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EvidenceDeleteManyArgs>(args?: SelectSubset<T, EvidenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Evidences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Evidences
     * const evidence = await prisma.evidence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EvidenceUpdateManyArgs>(args: SelectSubset<T, EvidenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Evidences and returns the data updated in the database.
     * @param {EvidenceUpdateManyAndReturnArgs} args - Arguments to update many Evidences.
     * @example
     * // Update many Evidences
     * const evidence = await prisma.evidence.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Evidences and only return the `id`
     * const evidenceWithIdOnly = await prisma.evidence.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EvidenceUpdateManyAndReturnArgs>(args: SelectSubset<T, EvidenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Evidence.
     * @param {EvidenceUpsertArgs} args - Arguments to update or create a Evidence.
     * @example
     * // Update or create a Evidence
     * const evidence = await prisma.evidence.upsert({
     *   create: {
     *     // ... data to create a Evidence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Evidence we want to update
     *   }
     * })
     */
    upsert<T extends EvidenceUpsertArgs>(args: SelectSubset<T, EvidenceUpsertArgs<ExtArgs>>): Prisma__EvidenceClient<$Result.GetResult<Prisma.$EvidencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Evidences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceCountArgs} args - Arguments to filter Evidences to count.
     * @example
     * // Count the number of Evidences
     * const count = await prisma.evidence.count({
     *   where: {
     *     // ... the filter for the Evidences we want to count
     *   }
     * })
    **/
    count<T extends EvidenceCountArgs>(
      args?: Subset<T, EvidenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EvidenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Evidence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EvidenceAggregateArgs>(args: Subset<T, EvidenceAggregateArgs>): Prisma.PrismaPromise<GetEvidenceAggregateType<T>>

    /**
     * Group by Evidence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EvidenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EvidenceGroupByArgs['orderBy'] }
        : { orderBy?: EvidenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EvidenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvidenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Evidence model
   */
  readonly fields: EvidenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Evidence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EvidenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    receipt<T extends WorkReceiptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceiptDefaultArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Evidence model
   */
  interface EvidenceFieldRefs {
    readonly id: FieldRef<"Evidence", 'String'>
    readonly receiptId: FieldRef<"Evidence", 'String'>
    readonly type: FieldRef<"Evidence", 'EvidenceType'>
    readonly url: FieldRef<"Evidence", 'String'>
    readonly originalFilename: FieldRef<"Evidence", 'String'>
    readonly mimeType: FieldRef<"Evidence", 'String'>
    readonly size: FieldRef<"Evidence", 'Int'>
    readonly description: FieldRef<"Evidence", 'String'>
    readonly createdAt: FieldRef<"Evidence", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Evidence findUnique
   */
  export type EvidenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * Filter, which Evidence to fetch.
     */
    where: EvidenceWhereUniqueInput
  }

  /**
   * Evidence findUniqueOrThrow
   */
  export type EvidenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * Filter, which Evidence to fetch.
     */
    where: EvidenceWhereUniqueInput
  }

  /**
   * Evidence findFirst
   */
  export type EvidenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * Filter, which Evidence to fetch.
     */
    where?: EvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Evidences to fetch.
     */
    orderBy?: EvidenceOrderByWithRelationInput | EvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Evidences.
     */
    cursor?: EvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Evidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Evidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Evidences.
     */
    distinct?: EvidenceScalarFieldEnum | EvidenceScalarFieldEnum[]
  }

  /**
   * Evidence findFirstOrThrow
   */
  export type EvidenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * Filter, which Evidence to fetch.
     */
    where?: EvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Evidences to fetch.
     */
    orderBy?: EvidenceOrderByWithRelationInput | EvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Evidences.
     */
    cursor?: EvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Evidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Evidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Evidences.
     */
    distinct?: EvidenceScalarFieldEnum | EvidenceScalarFieldEnum[]
  }

  /**
   * Evidence findMany
   */
  export type EvidenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * Filter, which Evidences to fetch.
     */
    where?: EvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Evidences to fetch.
     */
    orderBy?: EvidenceOrderByWithRelationInput | EvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Evidences.
     */
    cursor?: EvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Evidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Evidences.
     */
    skip?: number
    distinct?: EvidenceScalarFieldEnum | EvidenceScalarFieldEnum[]
  }

  /**
   * Evidence create
   */
  export type EvidenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * The data needed to create a Evidence.
     */
    data: XOR<EvidenceCreateInput, EvidenceUncheckedCreateInput>
  }

  /**
   * Evidence createMany
   */
  export type EvidenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Evidences.
     */
    data: EvidenceCreateManyInput | EvidenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Evidence createManyAndReturn
   */
  export type EvidenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * The data used to create many Evidences.
     */
    data: EvidenceCreateManyInput | EvidenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Evidence update
   */
  export type EvidenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * The data needed to update a Evidence.
     */
    data: XOR<EvidenceUpdateInput, EvidenceUncheckedUpdateInput>
    /**
     * Choose, which Evidence to update.
     */
    where: EvidenceWhereUniqueInput
  }

  /**
   * Evidence updateMany
   */
  export type EvidenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Evidences.
     */
    data: XOR<EvidenceUpdateManyMutationInput, EvidenceUncheckedUpdateManyInput>
    /**
     * Filter which Evidences to update
     */
    where?: EvidenceWhereInput
    /**
     * Limit how many Evidences to update.
     */
    limit?: number
  }

  /**
   * Evidence updateManyAndReturn
   */
  export type EvidenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * The data used to update Evidences.
     */
    data: XOR<EvidenceUpdateManyMutationInput, EvidenceUncheckedUpdateManyInput>
    /**
     * Filter which Evidences to update
     */
    where?: EvidenceWhereInput
    /**
     * Limit how many Evidences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Evidence upsert
   */
  export type EvidenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * The filter to search for the Evidence to update in case it exists.
     */
    where: EvidenceWhereUniqueInput
    /**
     * In case the Evidence found by the `where` argument doesn't exist, create a new Evidence with this data.
     */
    create: XOR<EvidenceCreateInput, EvidenceUncheckedCreateInput>
    /**
     * In case the Evidence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EvidenceUpdateInput, EvidenceUncheckedUpdateInput>
  }

  /**
   * Evidence delete
   */
  export type EvidenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
    /**
     * Filter which Evidence to delete.
     */
    where: EvidenceWhereUniqueInput
  }

  /**
   * Evidence deleteMany
   */
  export type EvidenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Evidences to delete
     */
    where?: EvidenceWhereInput
    /**
     * Limit how many Evidences to delete.
     */
    limit?: number
  }

  /**
   * Evidence without action
   */
  export type EvidenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evidence
     */
    select?: EvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evidence
     */
    omit?: EvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceInclude<ExtArgs> | null
  }


  /**
   * Model VerificationRequest
   */

  export type AggregateVerificationRequest = {
    _count: VerificationRequestCountAggregateOutputType | null
    _min: VerificationRequestMinAggregateOutputType | null
    _max: VerificationRequestMaxAggregateOutputType | null
  }

  export type VerificationRequestMinAggregateOutputType = {
    id: string | null
    receiptId: string | null
    tokenHash: string | null
    customerEmail: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type VerificationRequestMaxAggregateOutputType = {
    id: string | null
    receiptId: string | null
    tokenHash: string | null
    customerEmail: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type VerificationRequestCountAggregateOutputType = {
    id: number
    receiptId: number
    tokenHash: number
    customerEmail: number
    expiresAt: number
    usedAt: number
    createdAt: number
    _all: number
  }


  export type VerificationRequestMinAggregateInputType = {
    id?: true
    receiptId?: true
    tokenHash?: true
    customerEmail?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type VerificationRequestMaxAggregateInputType = {
    id?: true
    receiptId?: true
    tokenHash?: true
    customerEmail?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type VerificationRequestCountAggregateInputType = {
    id?: true
    receiptId?: true
    tokenHash?: true
    customerEmail?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    _all?: true
  }

  export type VerificationRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationRequest to aggregate.
     */
    where?: VerificationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationRequests to fetch.
     */
    orderBy?: VerificationRequestOrderByWithRelationInput | VerificationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationRequests
    **/
    _count?: true | VerificationRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationRequestMaxAggregateInputType
  }

  export type GetVerificationRequestAggregateType<T extends VerificationRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationRequest[P]>
      : GetScalarType<T[P], AggregateVerificationRequest[P]>
  }




  export type VerificationRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationRequestWhereInput
    orderBy?: VerificationRequestOrderByWithAggregationInput | VerificationRequestOrderByWithAggregationInput[]
    by: VerificationRequestScalarFieldEnum[] | VerificationRequestScalarFieldEnum
    having?: VerificationRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationRequestCountAggregateInputType | true
    _min?: VerificationRequestMinAggregateInputType
    _max?: VerificationRequestMaxAggregateInputType
  }

  export type VerificationRequestGroupByOutputType = {
    id: string
    receiptId: string
    tokenHash: string
    customerEmail: string
    expiresAt: Date
    usedAt: Date | null
    createdAt: Date
    _count: VerificationRequestCountAggregateOutputType | null
    _min: VerificationRequestMinAggregateOutputType | null
    _max: VerificationRequestMaxAggregateOutputType | null
  }

  type GetVerificationRequestGroupByPayload<T extends VerificationRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationRequestGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationRequestGroupByOutputType[P]>
        }
      >
    >


  export type VerificationRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    tokenHash?: boolean
    customerEmail?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["verificationRequest"]>

  export type VerificationRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    tokenHash?: boolean
    customerEmail?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["verificationRequest"]>

  export type VerificationRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    tokenHash?: boolean
    customerEmail?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["verificationRequest"]>

  export type VerificationRequestSelectScalar = {
    id?: boolean
    receiptId?: boolean
    tokenHash?: boolean
    customerEmail?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }

  export type VerificationRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "receiptId" | "tokenHash" | "customerEmail" | "expiresAt" | "usedAt" | "createdAt", ExtArgs["result"]["verificationRequest"]>
  export type VerificationRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }
  export type VerificationRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }
  export type VerificationRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }

  export type $VerificationRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationRequest"
    objects: {
      receipt: Prisma.$WorkReceiptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      receiptId: string
      tokenHash: string
      customerEmail: string
      expiresAt: Date
      usedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["verificationRequest"]>
    composites: {}
  }

  type VerificationRequestGetPayload<S extends boolean | null | undefined | VerificationRequestDefaultArgs> = $Result.GetResult<Prisma.$VerificationRequestPayload, S>

  type VerificationRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationRequestCountAggregateInputType | true
    }

  export interface VerificationRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationRequest'], meta: { name: 'VerificationRequest' } }
    /**
     * Find zero or one VerificationRequest that matches the filter.
     * @param {VerificationRequestFindUniqueArgs} args - Arguments to find a VerificationRequest
     * @example
     * // Get one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationRequestFindUniqueArgs>(args: SelectSubset<T, VerificationRequestFindUniqueArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationRequestFindUniqueOrThrowArgs} args - Arguments to find a VerificationRequest
     * @example
     * // Get one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationRequestFindFirstArgs} args - Arguments to find a VerificationRequest
     * @example
     * // Get one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationRequestFindFirstArgs>(args?: SelectSubset<T, VerificationRequestFindFirstArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationRequestFindFirstOrThrowArgs} args - Arguments to find a VerificationRequest
     * @example
     * // Get one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationRequests
     * const verificationRequests = await prisma.verificationRequest.findMany()
     * 
     * // Get first 10 VerificationRequests
     * const verificationRequests = await prisma.verificationRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationRequestWithIdOnly = await prisma.verificationRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationRequestFindManyArgs>(args?: SelectSubset<T, VerificationRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationRequest.
     * @param {VerificationRequestCreateArgs} args - Arguments to create a VerificationRequest.
     * @example
     * // Create one VerificationRequest
     * const VerificationRequest = await prisma.verificationRequest.create({
     *   data: {
     *     // ... data to create a VerificationRequest
     *   }
     * })
     * 
     */
    create<T extends VerificationRequestCreateArgs>(args: SelectSubset<T, VerificationRequestCreateArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationRequests.
     * @param {VerificationRequestCreateManyArgs} args - Arguments to create many VerificationRequests.
     * @example
     * // Create many VerificationRequests
     * const verificationRequest = await prisma.verificationRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationRequestCreateManyArgs>(args?: SelectSubset<T, VerificationRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationRequests and returns the data saved in the database.
     * @param {VerificationRequestCreateManyAndReturnArgs} args - Arguments to create many VerificationRequests.
     * @example
     * // Create many VerificationRequests
     * const verificationRequest = await prisma.verificationRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationRequests and only return the `id`
     * const verificationRequestWithIdOnly = await prisma.verificationRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationRequest.
     * @param {VerificationRequestDeleteArgs} args - Arguments to delete one VerificationRequest.
     * @example
     * // Delete one VerificationRequest
     * const VerificationRequest = await prisma.verificationRequest.delete({
     *   where: {
     *     // ... filter to delete one VerificationRequest
     *   }
     * })
     * 
     */
    delete<T extends VerificationRequestDeleteArgs>(args: SelectSubset<T, VerificationRequestDeleteArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationRequest.
     * @param {VerificationRequestUpdateArgs} args - Arguments to update one VerificationRequest.
     * @example
     * // Update one VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationRequestUpdateArgs>(args: SelectSubset<T, VerificationRequestUpdateArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationRequests.
     * @param {VerificationRequestDeleteManyArgs} args - Arguments to filter VerificationRequests to delete.
     * @example
     * // Delete a few VerificationRequests
     * const { count } = await prisma.verificationRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationRequestDeleteManyArgs>(args?: SelectSubset<T, VerificationRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationRequests
     * const verificationRequest = await prisma.verificationRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationRequestUpdateManyArgs>(args: SelectSubset<T, VerificationRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationRequests and returns the data updated in the database.
     * @param {VerificationRequestUpdateManyAndReturnArgs} args - Arguments to update many VerificationRequests.
     * @example
     * // Update many VerificationRequests
     * const verificationRequest = await prisma.verificationRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationRequests and only return the `id`
     * const verificationRequestWithIdOnly = await prisma.verificationRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationRequest.
     * @param {VerificationRequestUpsertArgs} args - Arguments to update or create a VerificationRequest.
     * @example
     * // Update or create a VerificationRequest
     * const verificationRequest = await prisma.verificationRequest.upsert({
     *   create: {
     *     // ... data to create a VerificationRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationRequest we want to update
     *   }
     * })
     */
    upsert<T extends VerificationRequestUpsertArgs>(args: SelectSubset<T, VerificationRequestUpsertArgs<ExtArgs>>): Prisma__VerificationRequestClient<$Result.GetResult<Prisma.$VerificationRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationRequestCountArgs} args - Arguments to filter VerificationRequests to count.
     * @example
     * // Count the number of VerificationRequests
     * const count = await prisma.verificationRequest.count({
     *   where: {
     *     // ... the filter for the VerificationRequests we want to count
     *   }
     * })
    **/
    count<T extends VerificationRequestCountArgs>(
      args?: Subset<T, VerificationRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationRequestAggregateArgs>(args: Subset<T, VerificationRequestAggregateArgs>): Prisma.PrismaPromise<GetVerificationRequestAggregateType<T>>

    /**
     * Group by VerificationRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationRequestGroupByArgs['orderBy'] }
        : { orderBy?: VerificationRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationRequest model
   */
  readonly fields: VerificationRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    receipt<T extends WorkReceiptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceiptDefaultArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationRequest model
   */
  interface VerificationRequestFieldRefs {
    readonly id: FieldRef<"VerificationRequest", 'String'>
    readonly receiptId: FieldRef<"VerificationRequest", 'String'>
    readonly tokenHash: FieldRef<"VerificationRequest", 'String'>
    readonly customerEmail: FieldRef<"VerificationRequest", 'String'>
    readonly expiresAt: FieldRef<"VerificationRequest", 'DateTime'>
    readonly usedAt: FieldRef<"VerificationRequest", 'DateTime'>
    readonly createdAt: FieldRef<"VerificationRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationRequest findUnique
   */
  export type VerificationRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * Filter, which VerificationRequest to fetch.
     */
    where: VerificationRequestWhereUniqueInput
  }

  /**
   * VerificationRequest findUniqueOrThrow
   */
  export type VerificationRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * Filter, which VerificationRequest to fetch.
     */
    where: VerificationRequestWhereUniqueInput
  }

  /**
   * VerificationRequest findFirst
   */
  export type VerificationRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * Filter, which VerificationRequest to fetch.
     */
    where?: VerificationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationRequests to fetch.
     */
    orderBy?: VerificationRequestOrderByWithRelationInput | VerificationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationRequests.
     */
    cursor?: VerificationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationRequests.
     */
    distinct?: VerificationRequestScalarFieldEnum | VerificationRequestScalarFieldEnum[]
  }

  /**
   * VerificationRequest findFirstOrThrow
   */
  export type VerificationRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * Filter, which VerificationRequest to fetch.
     */
    where?: VerificationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationRequests to fetch.
     */
    orderBy?: VerificationRequestOrderByWithRelationInput | VerificationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationRequests.
     */
    cursor?: VerificationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationRequests.
     */
    distinct?: VerificationRequestScalarFieldEnum | VerificationRequestScalarFieldEnum[]
  }

  /**
   * VerificationRequest findMany
   */
  export type VerificationRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * Filter, which VerificationRequests to fetch.
     */
    where?: VerificationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationRequests to fetch.
     */
    orderBy?: VerificationRequestOrderByWithRelationInput | VerificationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationRequests.
     */
    cursor?: VerificationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationRequests.
     */
    skip?: number
    distinct?: VerificationRequestScalarFieldEnum | VerificationRequestScalarFieldEnum[]
  }

  /**
   * VerificationRequest create
   */
  export type VerificationRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a VerificationRequest.
     */
    data: XOR<VerificationRequestCreateInput, VerificationRequestUncheckedCreateInput>
  }

  /**
   * VerificationRequest createMany
   */
  export type VerificationRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationRequests.
     */
    data: VerificationRequestCreateManyInput | VerificationRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationRequest createManyAndReturn
   */
  export type VerificationRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationRequests.
     */
    data: VerificationRequestCreateManyInput | VerificationRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VerificationRequest update
   */
  export type VerificationRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a VerificationRequest.
     */
    data: XOR<VerificationRequestUpdateInput, VerificationRequestUncheckedUpdateInput>
    /**
     * Choose, which VerificationRequest to update.
     */
    where: VerificationRequestWhereUniqueInput
  }

  /**
   * VerificationRequest updateMany
   */
  export type VerificationRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationRequests.
     */
    data: XOR<VerificationRequestUpdateManyMutationInput, VerificationRequestUncheckedUpdateManyInput>
    /**
     * Filter which VerificationRequests to update
     */
    where?: VerificationRequestWhereInput
    /**
     * Limit how many VerificationRequests to update.
     */
    limit?: number
  }

  /**
   * VerificationRequest updateManyAndReturn
   */
  export type VerificationRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * The data used to update VerificationRequests.
     */
    data: XOR<VerificationRequestUpdateManyMutationInput, VerificationRequestUncheckedUpdateManyInput>
    /**
     * Filter which VerificationRequests to update
     */
    where?: VerificationRequestWhereInput
    /**
     * Limit how many VerificationRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VerificationRequest upsert
   */
  export type VerificationRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the VerificationRequest to update in case it exists.
     */
    where: VerificationRequestWhereUniqueInput
    /**
     * In case the VerificationRequest found by the `where` argument doesn't exist, create a new VerificationRequest with this data.
     */
    create: XOR<VerificationRequestCreateInput, VerificationRequestUncheckedCreateInput>
    /**
     * In case the VerificationRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationRequestUpdateInput, VerificationRequestUncheckedUpdateInput>
  }

  /**
   * VerificationRequest delete
   */
  export type VerificationRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
    /**
     * Filter which VerificationRequest to delete.
     */
    where: VerificationRequestWhereUniqueInput
  }

  /**
   * VerificationRequest deleteMany
   */
  export type VerificationRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationRequests to delete
     */
    where?: VerificationRequestWhereInput
    /**
     * Limit how many VerificationRequests to delete.
     */
    limit?: number
  }

  /**
   * VerificationRequest without action
   */
  export type VerificationRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationRequest
     */
    select?: VerificationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationRequest
     */
    omit?: VerificationRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VerificationRequestInclude<ExtArgs> | null
  }


  /**
   * Model Confirmation
   */

  export type AggregateConfirmation = {
    _count: ConfirmationCountAggregateOutputType | null
    _min: ConfirmationMinAggregateOutputType | null
    _max: ConfirmationMaxAggregateOutputType | null
  }

  export type ConfirmationMinAggregateOutputType = {
    id: string | null
    receiptId: string | null
    decision: $Enums.ConfirmationDecision | null
    customerName: string | null
    customerEmail: string | null
    comment: string | null
    confirmedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type ConfirmationMaxAggregateOutputType = {
    id: string | null
    receiptId: string | null
    decision: $Enums.ConfirmationDecision | null
    customerName: string | null
    customerEmail: string | null
    comment: string | null
    confirmedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type ConfirmationCountAggregateOutputType = {
    id: number
    receiptId: number
    decision: number
    customerName: number
    customerEmail: number
    comment: number
    confirmedAt: number
    ipAddress: number
    userAgent: number
    _all: number
  }


  export type ConfirmationMinAggregateInputType = {
    id?: true
    receiptId?: true
    decision?: true
    customerName?: true
    customerEmail?: true
    comment?: true
    confirmedAt?: true
    ipAddress?: true
    userAgent?: true
  }

  export type ConfirmationMaxAggregateInputType = {
    id?: true
    receiptId?: true
    decision?: true
    customerName?: true
    customerEmail?: true
    comment?: true
    confirmedAt?: true
    ipAddress?: true
    userAgent?: true
  }

  export type ConfirmationCountAggregateInputType = {
    id?: true
    receiptId?: true
    decision?: true
    customerName?: true
    customerEmail?: true
    comment?: true
    confirmedAt?: true
    ipAddress?: true
    userAgent?: true
    _all?: true
  }

  export type ConfirmationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Confirmation to aggregate.
     */
    where?: ConfirmationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Confirmations to fetch.
     */
    orderBy?: ConfirmationOrderByWithRelationInput | ConfirmationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfirmationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Confirmations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Confirmations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Confirmations
    **/
    _count?: true | ConfirmationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfirmationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfirmationMaxAggregateInputType
  }

  export type GetConfirmationAggregateType<T extends ConfirmationAggregateArgs> = {
        [P in keyof T & keyof AggregateConfirmation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfirmation[P]>
      : GetScalarType<T[P], AggregateConfirmation[P]>
  }




  export type ConfirmationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfirmationWhereInput
    orderBy?: ConfirmationOrderByWithAggregationInput | ConfirmationOrderByWithAggregationInput[]
    by: ConfirmationScalarFieldEnum[] | ConfirmationScalarFieldEnum
    having?: ConfirmationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfirmationCountAggregateInputType | true
    _min?: ConfirmationMinAggregateInputType
    _max?: ConfirmationMaxAggregateInputType
  }

  export type ConfirmationGroupByOutputType = {
    id: string
    receiptId: string
    decision: $Enums.ConfirmationDecision
    customerName: string
    customerEmail: string
    comment: string | null
    confirmedAt: Date
    ipAddress: string | null
    userAgent: string | null
    _count: ConfirmationCountAggregateOutputType | null
    _min: ConfirmationMinAggregateOutputType | null
    _max: ConfirmationMaxAggregateOutputType | null
  }

  type GetConfirmationGroupByPayload<T extends ConfirmationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfirmationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfirmationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfirmationGroupByOutputType[P]>
            : GetScalarType<T[P], ConfirmationGroupByOutputType[P]>
        }
      >
    >


  export type ConfirmationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    decision?: boolean
    customerName?: boolean
    customerEmail?: boolean
    comment?: boolean
    confirmedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confirmation"]>

  export type ConfirmationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    decision?: boolean
    customerName?: boolean
    customerEmail?: boolean
    comment?: boolean
    confirmedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confirmation"]>

  export type ConfirmationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    decision?: boolean
    customerName?: boolean
    customerEmail?: boolean
    comment?: boolean
    confirmedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confirmation"]>

  export type ConfirmationSelectScalar = {
    id?: boolean
    receiptId?: boolean
    decision?: boolean
    customerName?: boolean
    customerEmail?: boolean
    comment?: boolean
    confirmedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }

  export type ConfirmationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "receiptId" | "decision" | "customerName" | "customerEmail" | "comment" | "confirmedAt" | "ipAddress" | "userAgent", ExtArgs["result"]["confirmation"]>
  export type ConfirmationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }
  export type ConfirmationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }
  export type ConfirmationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }

  export type $ConfirmationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Confirmation"
    objects: {
      receipt: Prisma.$WorkReceiptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      receiptId: string
      decision: $Enums.ConfirmationDecision
      customerName: string
      customerEmail: string
      comment: string | null
      confirmedAt: Date
      ipAddress: string | null
      userAgent: string | null
    }, ExtArgs["result"]["confirmation"]>
    composites: {}
  }

  type ConfirmationGetPayload<S extends boolean | null | undefined | ConfirmationDefaultArgs> = $Result.GetResult<Prisma.$ConfirmationPayload, S>

  type ConfirmationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConfirmationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConfirmationCountAggregateInputType | true
    }

  export interface ConfirmationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Confirmation'], meta: { name: 'Confirmation' } }
    /**
     * Find zero or one Confirmation that matches the filter.
     * @param {ConfirmationFindUniqueArgs} args - Arguments to find a Confirmation
     * @example
     * // Get one Confirmation
     * const confirmation = await prisma.confirmation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfirmationFindUniqueArgs>(args: SelectSubset<T, ConfirmationFindUniqueArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Confirmation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConfirmationFindUniqueOrThrowArgs} args - Arguments to find a Confirmation
     * @example
     * // Get one Confirmation
     * const confirmation = await prisma.confirmation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfirmationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfirmationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Confirmation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmationFindFirstArgs} args - Arguments to find a Confirmation
     * @example
     * // Get one Confirmation
     * const confirmation = await prisma.confirmation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfirmationFindFirstArgs>(args?: SelectSubset<T, ConfirmationFindFirstArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Confirmation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmationFindFirstOrThrowArgs} args - Arguments to find a Confirmation
     * @example
     * // Get one Confirmation
     * const confirmation = await prisma.confirmation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfirmationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfirmationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Confirmations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Confirmations
     * const confirmations = await prisma.confirmation.findMany()
     * 
     * // Get first 10 Confirmations
     * const confirmations = await prisma.confirmation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const confirmationWithIdOnly = await prisma.confirmation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfirmationFindManyArgs>(args?: SelectSubset<T, ConfirmationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Confirmation.
     * @param {ConfirmationCreateArgs} args - Arguments to create a Confirmation.
     * @example
     * // Create one Confirmation
     * const Confirmation = await prisma.confirmation.create({
     *   data: {
     *     // ... data to create a Confirmation
     *   }
     * })
     * 
     */
    create<T extends ConfirmationCreateArgs>(args: SelectSubset<T, ConfirmationCreateArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Confirmations.
     * @param {ConfirmationCreateManyArgs} args - Arguments to create many Confirmations.
     * @example
     * // Create many Confirmations
     * const confirmation = await prisma.confirmation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfirmationCreateManyArgs>(args?: SelectSubset<T, ConfirmationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Confirmations and returns the data saved in the database.
     * @param {ConfirmationCreateManyAndReturnArgs} args - Arguments to create many Confirmations.
     * @example
     * // Create many Confirmations
     * const confirmation = await prisma.confirmation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Confirmations and only return the `id`
     * const confirmationWithIdOnly = await prisma.confirmation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfirmationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfirmationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Confirmation.
     * @param {ConfirmationDeleteArgs} args - Arguments to delete one Confirmation.
     * @example
     * // Delete one Confirmation
     * const Confirmation = await prisma.confirmation.delete({
     *   where: {
     *     // ... filter to delete one Confirmation
     *   }
     * })
     * 
     */
    delete<T extends ConfirmationDeleteArgs>(args: SelectSubset<T, ConfirmationDeleteArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Confirmation.
     * @param {ConfirmationUpdateArgs} args - Arguments to update one Confirmation.
     * @example
     * // Update one Confirmation
     * const confirmation = await prisma.confirmation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfirmationUpdateArgs>(args: SelectSubset<T, ConfirmationUpdateArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Confirmations.
     * @param {ConfirmationDeleteManyArgs} args - Arguments to filter Confirmations to delete.
     * @example
     * // Delete a few Confirmations
     * const { count } = await prisma.confirmation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfirmationDeleteManyArgs>(args?: SelectSubset<T, ConfirmationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Confirmations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Confirmations
     * const confirmation = await prisma.confirmation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfirmationUpdateManyArgs>(args: SelectSubset<T, ConfirmationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Confirmations and returns the data updated in the database.
     * @param {ConfirmationUpdateManyAndReturnArgs} args - Arguments to update many Confirmations.
     * @example
     * // Update many Confirmations
     * const confirmation = await prisma.confirmation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Confirmations and only return the `id`
     * const confirmationWithIdOnly = await prisma.confirmation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConfirmationUpdateManyAndReturnArgs>(args: SelectSubset<T, ConfirmationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Confirmation.
     * @param {ConfirmationUpsertArgs} args - Arguments to update or create a Confirmation.
     * @example
     * // Update or create a Confirmation
     * const confirmation = await prisma.confirmation.upsert({
     *   create: {
     *     // ... data to create a Confirmation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Confirmation we want to update
     *   }
     * })
     */
    upsert<T extends ConfirmationUpsertArgs>(args: SelectSubset<T, ConfirmationUpsertArgs<ExtArgs>>): Prisma__ConfirmationClient<$Result.GetResult<Prisma.$ConfirmationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Confirmations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmationCountArgs} args - Arguments to filter Confirmations to count.
     * @example
     * // Count the number of Confirmations
     * const count = await prisma.confirmation.count({
     *   where: {
     *     // ... the filter for the Confirmations we want to count
     *   }
     * })
    **/
    count<T extends ConfirmationCountArgs>(
      args?: Subset<T, ConfirmationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfirmationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Confirmation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConfirmationAggregateArgs>(args: Subset<T, ConfirmationAggregateArgs>): Prisma.PrismaPromise<GetConfirmationAggregateType<T>>

    /**
     * Group by Confirmation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfirmationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConfirmationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfirmationGroupByArgs['orderBy'] }
        : { orderBy?: ConfirmationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConfirmationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfirmationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Confirmation model
   */
  readonly fields: ConfirmationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Confirmation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfirmationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    receipt<T extends WorkReceiptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceiptDefaultArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Confirmation model
   */
  interface ConfirmationFieldRefs {
    readonly id: FieldRef<"Confirmation", 'String'>
    readonly receiptId: FieldRef<"Confirmation", 'String'>
    readonly decision: FieldRef<"Confirmation", 'ConfirmationDecision'>
    readonly customerName: FieldRef<"Confirmation", 'String'>
    readonly customerEmail: FieldRef<"Confirmation", 'String'>
    readonly comment: FieldRef<"Confirmation", 'String'>
    readonly confirmedAt: FieldRef<"Confirmation", 'DateTime'>
    readonly ipAddress: FieldRef<"Confirmation", 'String'>
    readonly userAgent: FieldRef<"Confirmation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Confirmation findUnique
   */
  export type ConfirmationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which Confirmation to fetch.
     */
    where: ConfirmationWhereUniqueInput
  }

  /**
   * Confirmation findUniqueOrThrow
   */
  export type ConfirmationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which Confirmation to fetch.
     */
    where: ConfirmationWhereUniqueInput
  }

  /**
   * Confirmation findFirst
   */
  export type ConfirmationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which Confirmation to fetch.
     */
    where?: ConfirmationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Confirmations to fetch.
     */
    orderBy?: ConfirmationOrderByWithRelationInput | ConfirmationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Confirmations.
     */
    cursor?: ConfirmationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Confirmations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Confirmations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Confirmations.
     */
    distinct?: ConfirmationScalarFieldEnum | ConfirmationScalarFieldEnum[]
  }

  /**
   * Confirmation findFirstOrThrow
   */
  export type ConfirmationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which Confirmation to fetch.
     */
    where?: ConfirmationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Confirmations to fetch.
     */
    orderBy?: ConfirmationOrderByWithRelationInput | ConfirmationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Confirmations.
     */
    cursor?: ConfirmationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Confirmations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Confirmations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Confirmations.
     */
    distinct?: ConfirmationScalarFieldEnum | ConfirmationScalarFieldEnum[]
  }

  /**
   * Confirmation findMany
   */
  export type ConfirmationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which Confirmations to fetch.
     */
    where?: ConfirmationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Confirmations to fetch.
     */
    orderBy?: ConfirmationOrderByWithRelationInput | ConfirmationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Confirmations.
     */
    cursor?: ConfirmationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Confirmations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Confirmations.
     */
    skip?: number
    distinct?: ConfirmationScalarFieldEnum | ConfirmationScalarFieldEnum[]
  }

  /**
   * Confirmation create
   */
  export type ConfirmationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * The data needed to create a Confirmation.
     */
    data: XOR<ConfirmationCreateInput, ConfirmationUncheckedCreateInput>
  }

  /**
   * Confirmation createMany
   */
  export type ConfirmationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Confirmations.
     */
    data: ConfirmationCreateManyInput | ConfirmationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Confirmation createManyAndReturn
   */
  export type ConfirmationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * The data used to create many Confirmations.
     */
    data: ConfirmationCreateManyInput | ConfirmationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Confirmation update
   */
  export type ConfirmationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * The data needed to update a Confirmation.
     */
    data: XOR<ConfirmationUpdateInput, ConfirmationUncheckedUpdateInput>
    /**
     * Choose, which Confirmation to update.
     */
    where: ConfirmationWhereUniqueInput
  }

  /**
   * Confirmation updateMany
   */
  export type ConfirmationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Confirmations.
     */
    data: XOR<ConfirmationUpdateManyMutationInput, ConfirmationUncheckedUpdateManyInput>
    /**
     * Filter which Confirmations to update
     */
    where?: ConfirmationWhereInput
    /**
     * Limit how many Confirmations to update.
     */
    limit?: number
  }

  /**
   * Confirmation updateManyAndReturn
   */
  export type ConfirmationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * The data used to update Confirmations.
     */
    data: XOR<ConfirmationUpdateManyMutationInput, ConfirmationUncheckedUpdateManyInput>
    /**
     * Filter which Confirmations to update
     */
    where?: ConfirmationWhereInput
    /**
     * Limit how many Confirmations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Confirmation upsert
   */
  export type ConfirmationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * The filter to search for the Confirmation to update in case it exists.
     */
    where: ConfirmationWhereUniqueInput
    /**
     * In case the Confirmation found by the `where` argument doesn't exist, create a new Confirmation with this data.
     */
    create: XOR<ConfirmationCreateInput, ConfirmationUncheckedCreateInput>
    /**
     * In case the Confirmation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfirmationUpdateInput, ConfirmationUncheckedUpdateInput>
  }

  /**
   * Confirmation delete
   */
  export type ConfirmationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
    /**
     * Filter which Confirmation to delete.
     */
    where: ConfirmationWhereUniqueInput
  }

  /**
   * Confirmation deleteMany
   */
  export type ConfirmationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Confirmations to delete
     */
    where?: ConfirmationWhereInput
    /**
     * Limit how many Confirmations to delete.
     */
    limit?: number
  }

  /**
   * Confirmation without action
   */
  export type ConfirmationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Confirmation
     */
    select?: ConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Confirmation
     */
    omit?: ConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfirmationInclude<ExtArgs> | null
  }


  /**
   * Model Dispute
   */

  export type AggregateDispute = {
    _count: DisputeCountAggregateOutputType | null
    _min: DisputeMinAggregateOutputType | null
    _max: DisputeMaxAggregateOutputType | null
  }

  export type DisputeMinAggregateOutputType = {
    id: string | null
    receiptId: string | null
    reason: string | null
    description: string | null
    status: $Enums.DisputeStatus | null
    resolution: string | null
    openedAt: Date | null
    resolvedAt: Date | null
  }

  export type DisputeMaxAggregateOutputType = {
    id: string | null
    receiptId: string | null
    reason: string | null
    description: string | null
    status: $Enums.DisputeStatus | null
    resolution: string | null
    openedAt: Date | null
    resolvedAt: Date | null
  }

  export type DisputeCountAggregateOutputType = {
    id: number
    receiptId: number
    reason: number
    description: number
    status: number
    resolution: number
    openedAt: number
    resolvedAt: number
    _all: number
  }


  export type DisputeMinAggregateInputType = {
    id?: true
    receiptId?: true
    reason?: true
    description?: true
    status?: true
    resolution?: true
    openedAt?: true
    resolvedAt?: true
  }

  export type DisputeMaxAggregateInputType = {
    id?: true
    receiptId?: true
    reason?: true
    description?: true
    status?: true
    resolution?: true
    openedAt?: true
    resolvedAt?: true
  }

  export type DisputeCountAggregateInputType = {
    id?: true
    receiptId?: true
    reason?: true
    description?: true
    status?: true
    resolution?: true
    openedAt?: true
    resolvedAt?: true
    _all?: true
  }

  export type DisputeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dispute to aggregate.
     */
    where?: DisputeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disputes to fetch.
     */
    orderBy?: DisputeOrderByWithRelationInput | DisputeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DisputeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disputes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disputes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Disputes
    **/
    _count?: true | DisputeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DisputeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DisputeMaxAggregateInputType
  }

  export type GetDisputeAggregateType<T extends DisputeAggregateArgs> = {
        [P in keyof T & keyof AggregateDispute]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDispute[P]>
      : GetScalarType<T[P], AggregateDispute[P]>
  }




  export type DisputeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisputeWhereInput
    orderBy?: DisputeOrderByWithAggregationInput | DisputeOrderByWithAggregationInput[]
    by: DisputeScalarFieldEnum[] | DisputeScalarFieldEnum
    having?: DisputeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DisputeCountAggregateInputType | true
    _min?: DisputeMinAggregateInputType
    _max?: DisputeMaxAggregateInputType
  }

  export type DisputeGroupByOutputType = {
    id: string
    receiptId: string
    reason: string
    description: string
    status: $Enums.DisputeStatus
    resolution: string | null
    openedAt: Date
    resolvedAt: Date | null
    _count: DisputeCountAggregateOutputType | null
    _min: DisputeMinAggregateOutputType | null
    _max: DisputeMaxAggregateOutputType | null
  }

  type GetDisputeGroupByPayload<T extends DisputeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DisputeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DisputeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DisputeGroupByOutputType[P]>
            : GetScalarType<T[P], DisputeGroupByOutputType[P]>
        }
      >
    >


  export type DisputeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    reason?: boolean
    description?: boolean
    status?: boolean
    resolution?: boolean
    openedAt?: boolean
    resolvedAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dispute"]>

  export type DisputeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    reason?: boolean
    description?: boolean
    status?: boolean
    resolution?: boolean
    openedAt?: boolean
    resolvedAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dispute"]>

  export type DisputeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    reason?: boolean
    description?: boolean
    status?: boolean
    resolution?: boolean
    openedAt?: boolean
    resolvedAt?: boolean
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dispute"]>

  export type DisputeSelectScalar = {
    id?: boolean
    receiptId?: boolean
    reason?: boolean
    description?: boolean
    status?: boolean
    resolution?: boolean
    openedAt?: boolean
    resolvedAt?: boolean
  }

  export type DisputeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "receiptId" | "reason" | "description" | "status" | "resolution" | "openedAt" | "resolvedAt", ExtArgs["result"]["dispute"]>
  export type DisputeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }
  export type DisputeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }
  export type DisputeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | WorkReceiptDefaultArgs<ExtArgs>
  }

  export type $DisputePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Dispute"
    objects: {
      receipt: Prisma.$WorkReceiptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      receiptId: string
      reason: string
      description: string
      status: $Enums.DisputeStatus
      resolution: string | null
      openedAt: Date
      resolvedAt: Date | null
    }, ExtArgs["result"]["dispute"]>
    composites: {}
  }

  type DisputeGetPayload<S extends boolean | null | undefined | DisputeDefaultArgs> = $Result.GetResult<Prisma.$DisputePayload, S>

  type DisputeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DisputeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DisputeCountAggregateInputType | true
    }

  export interface DisputeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dispute'], meta: { name: 'Dispute' } }
    /**
     * Find zero or one Dispute that matches the filter.
     * @param {DisputeFindUniqueArgs} args - Arguments to find a Dispute
     * @example
     * // Get one Dispute
     * const dispute = await prisma.dispute.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DisputeFindUniqueArgs>(args: SelectSubset<T, DisputeFindUniqueArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Dispute that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DisputeFindUniqueOrThrowArgs} args - Arguments to find a Dispute
     * @example
     * // Get one Dispute
     * const dispute = await prisma.dispute.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DisputeFindUniqueOrThrowArgs>(args: SelectSubset<T, DisputeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dispute that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisputeFindFirstArgs} args - Arguments to find a Dispute
     * @example
     * // Get one Dispute
     * const dispute = await prisma.dispute.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DisputeFindFirstArgs>(args?: SelectSubset<T, DisputeFindFirstArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dispute that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisputeFindFirstOrThrowArgs} args - Arguments to find a Dispute
     * @example
     * // Get one Dispute
     * const dispute = await prisma.dispute.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DisputeFindFirstOrThrowArgs>(args?: SelectSubset<T, DisputeFindFirstOrThrowArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Disputes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisputeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Disputes
     * const disputes = await prisma.dispute.findMany()
     * 
     * // Get first 10 Disputes
     * const disputes = await prisma.dispute.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const disputeWithIdOnly = await prisma.dispute.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DisputeFindManyArgs>(args?: SelectSubset<T, DisputeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Dispute.
     * @param {DisputeCreateArgs} args - Arguments to create a Dispute.
     * @example
     * // Create one Dispute
     * const Dispute = await prisma.dispute.create({
     *   data: {
     *     // ... data to create a Dispute
     *   }
     * })
     * 
     */
    create<T extends DisputeCreateArgs>(args: SelectSubset<T, DisputeCreateArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Disputes.
     * @param {DisputeCreateManyArgs} args - Arguments to create many Disputes.
     * @example
     * // Create many Disputes
     * const dispute = await prisma.dispute.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DisputeCreateManyArgs>(args?: SelectSubset<T, DisputeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Disputes and returns the data saved in the database.
     * @param {DisputeCreateManyAndReturnArgs} args - Arguments to create many Disputes.
     * @example
     * // Create many Disputes
     * const dispute = await prisma.dispute.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Disputes and only return the `id`
     * const disputeWithIdOnly = await prisma.dispute.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DisputeCreateManyAndReturnArgs>(args?: SelectSubset<T, DisputeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Dispute.
     * @param {DisputeDeleteArgs} args - Arguments to delete one Dispute.
     * @example
     * // Delete one Dispute
     * const Dispute = await prisma.dispute.delete({
     *   where: {
     *     // ... filter to delete one Dispute
     *   }
     * })
     * 
     */
    delete<T extends DisputeDeleteArgs>(args: SelectSubset<T, DisputeDeleteArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Dispute.
     * @param {DisputeUpdateArgs} args - Arguments to update one Dispute.
     * @example
     * // Update one Dispute
     * const dispute = await prisma.dispute.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DisputeUpdateArgs>(args: SelectSubset<T, DisputeUpdateArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Disputes.
     * @param {DisputeDeleteManyArgs} args - Arguments to filter Disputes to delete.
     * @example
     * // Delete a few Disputes
     * const { count } = await prisma.dispute.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DisputeDeleteManyArgs>(args?: SelectSubset<T, DisputeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disputes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisputeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Disputes
     * const dispute = await prisma.dispute.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DisputeUpdateManyArgs>(args: SelectSubset<T, DisputeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disputes and returns the data updated in the database.
     * @param {DisputeUpdateManyAndReturnArgs} args - Arguments to update many Disputes.
     * @example
     * // Update many Disputes
     * const dispute = await prisma.dispute.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Disputes and only return the `id`
     * const disputeWithIdOnly = await prisma.dispute.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DisputeUpdateManyAndReturnArgs>(args: SelectSubset<T, DisputeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Dispute.
     * @param {DisputeUpsertArgs} args - Arguments to update or create a Dispute.
     * @example
     * // Update or create a Dispute
     * const dispute = await prisma.dispute.upsert({
     *   create: {
     *     // ... data to create a Dispute
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dispute we want to update
     *   }
     * })
     */
    upsert<T extends DisputeUpsertArgs>(args: SelectSubset<T, DisputeUpsertArgs<ExtArgs>>): Prisma__DisputeClient<$Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Disputes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisputeCountArgs} args - Arguments to filter Disputes to count.
     * @example
     * // Count the number of Disputes
     * const count = await prisma.dispute.count({
     *   where: {
     *     // ... the filter for the Disputes we want to count
     *   }
     * })
    **/
    count<T extends DisputeCountArgs>(
      args?: Subset<T, DisputeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DisputeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dispute.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisputeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DisputeAggregateArgs>(args: Subset<T, DisputeAggregateArgs>): Prisma.PrismaPromise<GetDisputeAggregateType<T>>

    /**
     * Group by Dispute.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisputeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DisputeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DisputeGroupByArgs['orderBy'] }
        : { orderBy?: DisputeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DisputeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDisputeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dispute model
   */
  readonly fields: DisputeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dispute.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DisputeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    receipt<T extends WorkReceiptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkReceiptDefaultArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Dispute model
   */
  interface DisputeFieldRefs {
    readonly id: FieldRef<"Dispute", 'String'>
    readonly receiptId: FieldRef<"Dispute", 'String'>
    readonly reason: FieldRef<"Dispute", 'String'>
    readonly description: FieldRef<"Dispute", 'String'>
    readonly status: FieldRef<"Dispute", 'DisputeStatus'>
    readonly resolution: FieldRef<"Dispute", 'String'>
    readonly openedAt: FieldRef<"Dispute", 'DateTime'>
    readonly resolvedAt: FieldRef<"Dispute", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Dispute findUnique
   */
  export type DisputeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * Filter, which Dispute to fetch.
     */
    where: DisputeWhereUniqueInput
  }

  /**
   * Dispute findUniqueOrThrow
   */
  export type DisputeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * Filter, which Dispute to fetch.
     */
    where: DisputeWhereUniqueInput
  }

  /**
   * Dispute findFirst
   */
  export type DisputeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * Filter, which Dispute to fetch.
     */
    where?: DisputeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disputes to fetch.
     */
    orderBy?: DisputeOrderByWithRelationInput | DisputeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Disputes.
     */
    cursor?: DisputeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disputes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disputes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Disputes.
     */
    distinct?: DisputeScalarFieldEnum | DisputeScalarFieldEnum[]
  }

  /**
   * Dispute findFirstOrThrow
   */
  export type DisputeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * Filter, which Dispute to fetch.
     */
    where?: DisputeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disputes to fetch.
     */
    orderBy?: DisputeOrderByWithRelationInput | DisputeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Disputes.
     */
    cursor?: DisputeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disputes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disputes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Disputes.
     */
    distinct?: DisputeScalarFieldEnum | DisputeScalarFieldEnum[]
  }

  /**
   * Dispute findMany
   */
  export type DisputeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * Filter, which Disputes to fetch.
     */
    where?: DisputeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disputes to fetch.
     */
    orderBy?: DisputeOrderByWithRelationInput | DisputeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Disputes.
     */
    cursor?: DisputeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disputes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disputes.
     */
    skip?: number
    distinct?: DisputeScalarFieldEnum | DisputeScalarFieldEnum[]
  }

  /**
   * Dispute create
   */
  export type DisputeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * The data needed to create a Dispute.
     */
    data: XOR<DisputeCreateInput, DisputeUncheckedCreateInput>
  }

  /**
   * Dispute createMany
   */
  export type DisputeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Disputes.
     */
    data: DisputeCreateManyInput | DisputeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dispute createManyAndReturn
   */
  export type DisputeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * The data used to create many Disputes.
     */
    data: DisputeCreateManyInput | DisputeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Dispute update
   */
  export type DisputeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * The data needed to update a Dispute.
     */
    data: XOR<DisputeUpdateInput, DisputeUncheckedUpdateInput>
    /**
     * Choose, which Dispute to update.
     */
    where: DisputeWhereUniqueInput
  }

  /**
   * Dispute updateMany
   */
  export type DisputeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Disputes.
     */
    data: XOR<DisputeUpdateManyMutationInput, DisputeUncheckedUpdateManyInput>
    /**
     * Filter which Disputes to update
     */
    where?: DisputeWhereInput
    /**
     * Limit how many Disputes to update.
     */
    limit?: number
  }

  /**
   * Dispute updateManyAndReturn
   */
  export type DisputeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * The data used to update Disputes.
     */
    data: XOR<DisputeUpdateManyMutationInput, DisputeUncheckedUpdateManyInput>
    /**
     * Filter which Disputes to update
     */
    where?: DisputeWhereInput
    /**
     * Limit how many Disputes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Dispute upsert
   */
  export type DisputeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * The filter to search for the Dispute to update in case it exists.
     */
    where: DisputeWhereUniqueInput
    /**
     * In case the Dispute found by the `where` argument doesn't exist, create a new Dispute with this data.
     */
    create: XOR<DisputeCreateInput, DisputeUncheckedCreateInput>
    /**
     * In case the Dispute was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DisputeUpdateInput, DisputeUncheckedUpdateInput>
  }

  /**
   * Dispute delete
   */
  export type DisputeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
    /**
     * Filter which Dispute to delete.
     */
    where: DisputeWhereUniqueInput
  }

  /**
   * Dispute deleteMany
   */
  export type DisputeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Disputes to delete
     */
    where?: DisputeWhereInput
    /**
     * Limit how many Disputes to delete.
     */
    limit?: number
  }

  /**
   * Dispute without action
   */
  export type DisputeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispute
     */
    select?: DisputeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dispute
     */
    omit?: DisputeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisputeInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    actorId: string | null
    receiptId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    actorId: string | null
    receiptId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    actorId: number
    receiptId: number
    action: number
    entityType: number
    entityId: number
    metadata: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    actorId?: true
    receiptId?: true
    action?: true
    entityType?: true
    entityId?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    actorId?: true
    receiptId?: true
    action?: true
    entityType?: true
    entityId?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    actorId?: true
    receiptId?: true
    action?: true
    entityType?: true
    entityId?: true
    metadata?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    actorId: string | null
    receiptId: string | null
    action: string
    entityType: string
    entityId: string
    metadata: JsonValue | null
    ipAddress: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    receiptId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    actor?: boolean | AuditLog$actorArgs<ExtArgs>
    receipt?: boolean | AuditLog$receiptArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    receiptId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    actor?: boolean | AuditLog$actorArgs<ExtArgs>
    receipt?: boolean | AuditLog$receiptArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    receiptId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    actor?: boolean | AuditLog$actorArgs<ExtArgs>
    receipt?: boolean | AuditLog$receiptArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    actorId?: boolean
    receiptId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "actorId" | "receiptId" | "action" | "entityType" | "entityId" | "metadata" | "ipAddress" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actor?: boolean | AuditLog$actorArgs<ExtArgs>
    receipt?: boolean | AuditLog$receiptArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actor?: boolean | AuditLog$actorArgs<ExtArgs>
    receipt?: boolean | AuditLog$receiptArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actor?: boolean | AuditLog$actorArgs<ExtArgs>
    receipt?: boolean | AuditLog$receiptArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      actor: Prisma.$UserPayload<ExtArgs> | null
      receipt: Prisma.$WorkReceiptPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      actorId: string | null
      receiptId: string | null
      action: string
      entityType: string
      entityId: string
      metadata: Prisma.JsonValue | null
      ipAddress: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    actor<T extends AuditLog$actorArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$actorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    receipt<T extends AuditLog$receiptArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$receiptArgs<ExtArgs>>): Prisma__WorkReceiptClient<$Result.GetResult<Prisma.$WorkReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly actorId: FieldRef<"AuditLog", 'String'>
    readonly receiptId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entityType: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.actor
   */
  export type AuditLog$actorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog.receipt
   */
  export type AuditLog$receiptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkReceipt
     */
    select?: WorkReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkReceipt
     */
    omit?: WorkReceiptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkReceiptInclude<ExtArgs> | null
    where?: WorkReceiptWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    fullName: 'fullName',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const WorkerProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    headline: 'headline',
    bio: 'bio',
    location: 'location',
    phone: 'phone',
    skills: 'skills',
    profileSlug: 'profileSlug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkerProfileScalarFieldEnum = (typeof WorkerProfileScalarFieldEnum)[keyof typeof WorkerProfileScalarFieldEnum]


  export const OrganisationScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    name: 'name',
    description: 'description',
    website: 'website',
    location: 'location',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrganisationScalarFieldEnum = (typeof OrganisationScalarFieldEnum)[keyof typeof OrganisationScalarFieldEnum]


  export const WorkReceiptScalarFieldEnum: {
    id: 'id',
    receiptNumber: 'receiptNumber',
    workerId: 'workerId',
    customerName: 'customerName',
    customerEmail: 'customerEmail',
    customerPhone: 'customerPhone',
    serviceTitle: 'serviceTitle',
    description: 'description',
    workDate: 'workDate',
    durationMinutes: 'durationMinutes',
    amount: 'amount',
    currency: 'currency',
    skillsDemonstrated: 'skillsDemonstrated',
    status: 'status',
    visibility: 'visibility',
    verificationCode: 'verificationCode',
    integrityHash: 'integrityHash',
    submittedAt: 'submittedAt',
    verifiedAt: 'verifiedAt',
    lockedAt: 'lockedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkReceiptScalarFieldEnum = (typeof WorkReceiptScalarFieldEnum)[keyof typeof WorkReceiptScalarFieldEnum]


  export const EvidenceScalarFieldEnum: {
    id: 'id',
    receiptId: 'receiptId',
    type: 'type',
    url: 'url',
    originalFilename: 'originalFilename',
    mimeType: 'mimeType',
    size: 'size',
    description: 'description',
    createdAt: 'createdAt'
  };

  export type EvidenceScalarFieldEnum = (typeof EvidenceScalarFieldEnum)[keyof typeof EvidenceScalarFieldEnum]


  export const VerificationRequestScalarFieldEnum: {
    id: 'id',
    receiptId: 'receiptId',
    tokenHash: 'tokenHash',
    customerEmail: 'customerEmail',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
  };

  export type VerificationRequestScalarFieldEnum = (typeof VerificationRequestScalarFieldEnum)[keyof typeof VerificationRequestScalarFieldEnum]


  export const ConfirmationScalarFieldEnum: {
    id: 'id',
    receiptId: 'receiptId',
    decision: 'decision',
    customerName: 'customerName',
    customerEmail: 'customerEmail',
    comment: 'comment',
    confirmedAt: 'confirmedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
  };

  export type ConfirmationScalarFieldEnum = (typeof ConfirmationScalarFieldEnum)[keyof typeof ConfirmationScalarFieldEnum]


  export const DisputeScalarFieldEnum: {
    id: 'id',
    receiptId: 'receiptId',
    reason: 'reason',
    description: 'description',
    status: 'status',
    resolution: 'resolution',
    openedAt: 'openedAt',
    resolvedAt: 'resolvedAt'
  };

  export type DisputeScalarFieldEnum = (typeof DisputeScalarFieldEnum)[keyof typeof DisputeScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    actorId: 'actorId',
    receiptId: 'receiptId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    metadata: 'metadata',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'ReceiptStatus'
   */
  export type EnumReceiptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReceiptStatus'>
    


  /**
   * Reference to a field of type 'ReceiptStatus[]'
   */
  export type ListEnumReceiptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReceiptStatus[]'>
    


  /**
   * Reference to a field of type 'Visibility'
   */
  export type EnumVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Visibility'>
    


  /**
   * Reference to a field of type 'Visibility[]'
   */
  export type ListEnumVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Visibility[]'>
    


  /**
   * Reference to a field of type 'EvidenceType'
   */
  export type EnumEvidenceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvidenceType'>
    


  /**
   * Reference to a field of type 'EvidenceType[]'
   */
  export type ListEnumEvidenceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvidenceType[]'>
    


  /**
   * Reference to a field of type 'ConfirmationDecision'
   */
  export type EnumConfirmationDecisionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConfirmationDecision'>
    


  /**
   * Reference to a field of type 'ConfirmationDecision[]'
   */
  export type ListEnumConfirmationDecisionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConfirmationDecision[]'>
    


  /**
   * Reference to a field of type 'DisputeStatus'
   */
  export type EnumDisputeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DisputeStatus'>
    


  /**
   * Reference to a field of type 'DisputeStatus[]'
   */
  export type ListEnumDisputeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DisputeStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    workerProfile?: XOR<WorkerProfileNullableScalarRelationFilter, WorkerProfileWhereInput> | null
    organisation?: XOR<OrganisationNullableScalarRelationFilter, OrganisationWhereInput> | null
    receipts?: WorkReceiptListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workerProfile?: WorkerProfileOrderByWithRelationInput
    organisation?: OrganisationOrderByWithRelationInput
    receipts?: WorkReceiptOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    workerProfile?: XOR<WorkerProfileNullableScalarRelationFilter, WorkerProfileWhereInput> | null
    organisation?: XOR<OrganisationNullableScalarRelationFilter, OrganisationWhereInput> | null
    receipts?: WorkReceiptListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type WorkerProfileWhereInput = {
    AND?: WorkerProfileWhereInput | WorkerProfileWhereInput[]
    OR?: WorkerProfileWhereInput[]
    NOT?: WorkerProfileWhereInput | WorkerProfileWhereInput[]
    id?: UuidFilter<"WorkerProfile"> | string
    userId?: UuidFilter<"WorkerProfile"> | string
    headline?: StringNullableFilter<"WorkerProfile"> | string | null
    bio?: StringNullableFilter<"WorkerProfile"> | string | null
    location?: StringNullableFilter<"WorkerProfile"> | string | null
    phone?: StringNullableFilter<"WorkerProfile"> | string | null
    skills?: StringNullableListFilter<"WorkerProfile">
    profileSlug?: StringFilter<"WorkerProfile"> | string
    createdAt?: DateTimeFilter<"WorkerProfile"> | Date | string
    updatedAt?: DateTimeFilter<"WorkerProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type WorkerProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    headline?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    skills?: SortOrder
    profileSlug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type WorkerProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    profileSlug?: string
    AND?: WorkerProfileWhereInput | WorkerProfileWhereInput[]
    OR?: WorkerProfileWhereInput[]
    NOT?: WorkerProfileWhereInput | WorkerProfileWhereInput[]
    headline?: StringNullableFilter<"WorkerProfile"> | string | null
    bio?: StringNullableFilter<"WorkerProfile"> | string | null
    location?: StringNullableFilter<"WorkerProfile"> | string | null
    phone?: StringNullableFilter<"WorkerProfile"> | string | null
    skills?: StringNullableListFilter<"WorkerProfile">
    createdAt?: DateTimeFilter<"WorkerProfile"> | Date | string
    updatedAt?: DateTimeFilter<"WorkerProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId" | "profileSlug">

  export type WorkerProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    headline?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    skills?: SortOrder
    profileSlug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkerProfileCountOrderByAggregateInput
    _max?: WorkerProfileMaxOrderByAggregateInput
    _min?: WorkerProfileMinOrderByAggregateInput
  }

  export type WorkerProfileScalarWhereWithAggregatesInput = {
    AND?: WorkerProfileScalarWhereWithAggregatesInput | WorkerProfileScalarWhereWithAggregatesInput[]
    OR?: WorkerProfileScalarWhereWithAggregatesInput[]
    NOT?: WorkerProfileScalarWhereWithAggregatesInput | WorkerProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"WorkerProfile"> | string
    userId?: UuidWithAggregatesFilter<"WorkerProfile"> | string
    headline?: StringNullableWithAggregatesFilter<"WorkerProfile"> | string | null
    bio?: StringNullableWithAggregatesFilter<"WorkerProfile"> | string | null
    location?: StringNullableWithAggregatesFilter<"WorkerProfile"> | string | null
    phone?: StringNullableWithAggregatesFilter<"WorkerProfile"> | string | null
    skills?: StringNullableListFilter<"WorkerProfile">
    profileSlug?: StringWithAggregatesFilter<"WorkerProfile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WorkerProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WorkerProfile"> | Date | string
  }

  export type OrganisationWhereInput = {
    AND?: OrganisationWhereInput | OrganisationWhereInput[]
    OR?: OrganisationWhereInput[]
    NOT?: OrganisationWhereInput | OrganisationWhereInput[]
    id?: UuidFilter<"Organisation"> | string
    ownerId?: UuidFilter<"Organisation"> | string
    name?: StringFilter<"Organisation"> | string
    description?: StringNullableFilter<"Organisation"> | string | null
    website?: StringNullableFilter<"Organisation"> | string | null
    location?: StringNullableFilter<"Organisation"> | string | null
    createdAt?: DateTimeFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeFilter<"Organisation"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OrganisationOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
  }

  export type OrganisationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ownerId?: string
    AND?: OrganisationWhereInput | OrganisationWhereInput[]
    OR?: OrganisationWhereInput[]
    NOT?: OrganisationWhereInput | OrganisationWhereInput[]
    name?: StringFilter<"Organisation"> | string
    description?: StringNullableFilter<"Organisation"> | string | null
    website?: StringNullableFilter<"Organisation"> | string | null
    location?: StringNullableFilter<"Organisation"> | string | null
    createdAt?: DateTimeFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeFilter<"Organisation"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "ownerId">

  export type OrganisationOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrganisationCountOrderByAggregateInput
    _max?: OrganisationMaxOrderByAggregateInput
    _min?: OrganisationMinOrderByAggregateInput
  }

  export type OrganisationScalarWhereWithAggregatesInput = {
    AND?: OrganisationScalarWhereWithAggregatesInput | OrganisationScalarWhereWithAggregatesInput[]
    OR?: OrganisationScalarWhereWithAggregatesInput[]
    NOT?: OrganisationScalarWhereWithAggregatesInput | OrganisationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Organisation"> | string
    ownerId?: UuidWithAggregatesFilter<"Organisation"> | string
    name?: StringWithAggregatesFilter<"Organisation"> | string
    description?: StringNullableWithAggregatesFilter<"Organisation"> | string | null
    website?: StringNullableWithAggregatesFilter<"Organisation"> | string | null
    location?: StringNullableWithAggregatesFilter<"Organisation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Organisation"> | Date | string
  }

  export type WorkReceiptWhereInput = {
    AND?: WorkReceiptWhereInput | WorkReceiptWhereInput[]
    OR?: WorkReceiptWhereInput[]
    NOT?: WorkReceiptWhereInput | WorkReceiptWhereInput[]
    id?: UuidFilter<"WorkReceipt"> | string
    receiptNumber?: StringNullableFilter<"WorkReceipt"> | string | null
    workerId?: UuidFilter<"WorkReceipt"> | string
    customerName?: StringFilter<"WorkReceipt"> | string
    customerEmail?: StringFilter<"WorkReceipt"> | string
    customerPhone?: StringNullableFilter<"WorkReceipt"> | string | null
    serviceTitle?: StringFilter<"WorkReceipt"> | string
    description?: StringFilter<"WorkReceipt"> | string
    workDate?: DateTimeFilter<"WorkReceipt"> | Date | string
    durationMinutes?: IntNullableFilter<"WorkReceipt"> | number | null
    amount?: DecimalNullableFilter<"WorkReceipt"> | Decimal | DecimalJsLike | number | string | null
    currency?: StringFilter<"WorkReceipt"> | string
    skillsDemonstrated?: StringNullableListFilter<"WorkReceipt">
    status?: EnumReceiptStatusFilter<"WorkReceipt"> | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFilter<"WorkReceipt"> | $Enums.Visibility
    verificationCode?: StringNullableFilter<"WorkReceipt"> | string | null
    integrityHash?: StringNullableFilter<"WorkReceipt"> | string | null
    submittedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    verifiedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    lockedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    createdAt?: DateTimeFilter<"WorkReceipt"> | Date | string
    updatedAt?: DateTimeFilter<"WorkReceipt"> | Date | string
    worker?: XOR<UserScalarRelationFilter, UserWhereInput>
    evidence?: EvidenceListRelationFilter
    verificationRequest?: XOR<VerificationRequestNullableScalarRelationFilter, VerificationRequestWhereInput> | null
    confirmation?: XOR<ConfirmationNullableScalarRelationFilter, ConfirmationWhereInput> | null
    dispute?: XOR<DisputeNullableScalarRelationFilter, DisputeWhereInput> | null
    auditLogs?: AuditLogListRelationFilter
  }

  export type WorkReceiptOrderByWithRelationInput = {
    id?: SortOrder
    receiptNumber?: SortOrderInput | SortOrder
    workerId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrderInput | SortOrder
    serviceTitle?: SortOrder
    description?: SortOrder
    workDate?: SortOrder
    durationMinutes?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    currency?: SortOrder
    skillsDemonstrated?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    verificationCode?: SortOrderInput | SortOrder
    integrityHash?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    lockedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    worker?: UserOrderByWithRelationInput
    evidence?: EvidenceOrderByRelationAggregateInput
    verificationRequest?: VerificationRequestOrderByWithRelationInput
    confirmation?: ConfirmationOrderByWithRelationInput
    dispute?: DisputeOrderByWithRelationInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type WorkReceiptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    receiptNumber?: string
    verificationCode?: string
    AND?: WorkReceiptWhereInput | WorkReceiptWhereInput[]
    OR?: WorkReceiptWhereInput[]
    NOT?: WorkReceiptWhereInput | WorkReceiptWhereInput[]
    workerId?: UuidFilter<"WorkReceipt"> | string
    customerName?: StringFilter<"WorkReceipt"> | string
    customerEmail?: StringFilter<"WorkReceipt"> | string
    customerPhone?: StringNullableFilter<"WorkReceipt"> | string | null
    serviceTitle?: StringFilter<"WorkReceipt"> | string
    description?: StringFilter<"WorkReceipt"> | string
    workDate?: DateTimeFilter<"WorkReceipt"> | Date | string
    durationMinutes?: IntNullableFilter<"WorkReceipt"> | number | null
    amount?: DecimalNullableFilter<"WorkReceipt"> | Decimal | DecimalJsLike | number | string | null
    currency?: StringFilter<"WorkReceipt"> | string
    skillsDemonstrated?: StringNullableListFilter<"WorkReceipt">
    status?: EnumReceiptStatusFilter<"WorkReceipt"> | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFilter<"WorkReceipt"> | $Enums.Visibility
    integrityHash?: StringNullableFilter<"WorkReceipt"> | string | null
    submittedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    verifiedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    lockedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    createdAt?: DateTimeFilter<"WorkReceipt"> | Date | string
    updatedAt?: DateTimeFilter<"WorkReceipt"> | Date | string
    worker?: XOR<UserScalarRelationFilter, UserWhereInput>
    evidence?: EvidenceListRelationFilter
    verificationRequest?: XOR<VerificationRequestNullableScalarRelationFilter, VerificationRequestWhereInput> | null
    confirmation?: XOR<ConfirmationNullableScalarRelationFilter, ConfirmationWhereInput> | null
    dispute?: XOR<DisputeNullableScalarRelationFilter, DisputeWhereInput> | null
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "receiptNumber" | "verificationCode">

  export type WorkReceiptOrderByWithAggregationInput = {
    id?: SortOrder
    receiptNumber?: SortOrderInput | SortOrder
    workerId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrderInput | SortOrder
    serviceTitle?: SortOrder
    description?: SortOrder
    workDate?: SortOrder
    durationMinutes?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    currency?: SortOrder
    skillsDemonstrated?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    verificationCode?: SortOrderInput | SortOrder
    integrityHash?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    lockedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkReceiptCountOrderByAggregateInput
    _avg?: WorkReceiptAvgOrderByAggregateInput
    _max?: WorkReceiptMaxOrderByAggregateInput
    _min?: WorkReceiptMinOrderByAggregateInput
    _sum?: WorkReceiptSumOrderByAggregateInput
  }

  export type WorkReceiptScalarWhereWithAggregatesInput = {
    AND?: WorkReceiptScalarWhereWithAggregatesInput | WorkReceiptScalarWhereWithAggregatesInput[]
    OR?: WorkReceiptScalarWhereWithAggregatesInput[]
    NOT?: WorkReceiptScalarWhereWithAggregatesInput | WorkReceiptScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"WorkReceipt"> | string
    receiptNumber?: StringNullableWithAggregatesFilter<"WorkReceipt"> | string | null
    workerId?: UuidWithAggregatesFilter<"WorkReceipt"> | string
    customerName?: StringWithAggregatesFilter<"WorkReceipt"> | string
    customerEmail?: StringWithAggregatesFilter<"WorkReceipt"> | string
    customerPhone?: StringNullableWithAggregatesFilter<"WorkReceipt"> | string | null
    serviceTitle?: StringWithAggregatesFilter<"WorkReceipt"> | string
    description?: StringWithAggregatesFilter<"WorkReceipt"> | string
    workDate?: DateTimeWithAggregatesFilter<"WorkReceipt"> | Date | string
    durationMinutes?: IntNullableWithAggregatesFilter<"WorkReceipt"> | number | null
    amount?: DecimalNullableWithAggregatesFilter<"WorkReceipt"> | Decimal | DecimalJsLike | number | string | null
    currency?: StringWithAggregatesFilter<"WorkReceipt"> | string
    skillsDemonstrated?: StringNullableListFilter<"WorkReceipt">
    status?: EnumReceiptStatusWithAggregatesFilter<"WorkReceipt"> | $Enums.ReceiptStatus
    visibility?: EnumVisibilityWithAggregatesFilter<"WorkReceipt"> | $Enums.Visibility
    verificationCode?: StringNullableWithAggregatesFilter<"WorkReceipt"> | string | null
    integrityHash?: StringNullableWithAggregatesFilter<"WorkReceipt"> | string | null
    submittedAt?: DateTimeNullableWithAggregatesFilter<"WorkReceipt"> | Date | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"WorkReceipt"> | Date | string | null
    lockedAt?: DateTimeNullableWithAggregatesFilter<"WorkReceipt"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WorkReceipt"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WorkReceipt"> | Date | string
  }

  export type EvidenceWhereInput = {
    AND?: EvidenceWhereInput | EvidenceWhereInput[]
    OR?: EvidenceWhereInput[]
    NOT?: EvidenceWhereInput | EvidenceWhereInput[]
    id?: UuidFilter<"Evidence"> | string
    receiptId?: UuidFilter<"Evidence"> | string
    type?: EnumEvidenceTypeFilter<"Evidence"> | $Enums.EvidenceType
    url?: StringFilter<"Evidence"> | string
    originalFilename?: StringNullableFilter<"Evidence"> | string | null
    mimeType?: StringNullableFilter<"Evidence"> | string | null
    size?: IntNullableFilter<"Evidence"> | number | null
    description?: StringNullableFilter<"Evidence"> | string | null
    createdAt?: DateTimeFilter<"Evidence"> | Date | string
    receipt?: XOR<WorkReceiptScalarRelationFilter, WorkReceiptWhereInput>
  }

  export type EvidenceOrderByWithRelationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    type?: SortOrder
    url?: SortOrder
    originalFilename?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    size?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    receipt?: WorkReceiptOrderByWithRelationInput
  }

  export type EvidenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EvidenceWhereInput | EvidenceWhereInput[]
    OR?: EvidenceWhereInput[]
    NOT?: EvidenceWhereInput | EvidenceWhereInput[]
    receiptId?: UuidFilter<"Evidence"> | string
    type?: EnumEvidenceTypeFilter<"Evidence"> | $Enums.EvidenceType
    url?: StringFilter<"Evidence"> | string
    originalFilename?: StringNullableFilter<"Evidence"> | string | null
    mimeType?: StringNullableFilter<"Evidence"> | string | null
    size?: IntNullableFilter<"Evidence"> | number | null
    description?: StringNullableFilter<"Evidence"> | string | null
    createdAt?: DateTimeFilter<"Evidence"> | Date | string
    receipt?: XOR<WorkReceiptScalarRelationFilter, WorkReceiptWhereInput>
  }, "id">

  export type EvidenceOrderByWithAggregationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    type?: SortOrder
    url?: SortOrder
    originalFilename?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    size?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: EvidenceCountOrderByAggregateInput
    _avg?: EvidenceAvgOrderByAggregateInput
    _max?: EvidenceMaxOrderByAggregateInput
    _min?: EvidenceMinOrderByAggregateInput
    _sum?: EvidenceSumOrderByAggregateInput
  }

  export type EvidenceScalarWhereWithAggregatesInput = {
    AND?: EvidenceScalarWhereWithAggregatesInput | EvidenceScalarWhereWithAggregatesInput[]
    OR?: EvidenceScalarWhereWithAggregatesInput[]
    NOT?: EvidenceScalarWhereWithAggregatesInput | EvidenceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Evidence"> | string
    receiptId?: UuidWithAggregatesFilter<"Evidence"> | string
    type?: EnumEvidenceTypeWithAggregatesFilter<"Evidence"> | $Enums.EvidenceType
    url?: StringWithAggregatesFilter<"Evidence"> | string
    originalFilename?: StringNullableWithAggregatesFilter<"Evidence"> | string | null
    mimeType?: StringNullableWithAggregatesFilter<"Evidence"> | string | null
    size?: IntNullableWithAggregatesFilter<"Evidence"> | number | null
    description?: StringNullableWithAggregatesFilter<"Evidence"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Evidence"> | Date | string
  }

  export type VerificationRequestWhereInput = {
    AND?: VerificationRequestWhereInput | VerificationRequestWhereInput[]
    OR?: VerificationRequestWhereInput[]
    NOT?: VerificationRequestWhereInput | VerificationRequestWhereInput[]
    id?: UuidFilter<"VerificationRequest"> | string
    receiptId?: UuidFilter<"VerificationRequest"> | string
    tokenHash?: StringFilter<"VerificationRequest"> | string
    customerEmail?: StringFilter<"VerificationRequest"> | string
    expiresAt?: DateTimeFilter<"VerificationRequest"> | Date | string
    usedAt?: DateTimeNullableFilter<"VerificationRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"VerificationRequest"> | Date | string
    receipt?: XOR<WorkReceiptScalarRelationFilter, WorkReceiptWhereInput>
  }

  export type VerificationRequestOrderByWithRelationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    tokenHash?: SortOrder
    customerEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    receipt?: WorkReceiptOrderByWithRelationInput
  }

  export type VerificationRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    receiptId?: string
    tokenHash?: string
    AND?: VerificationRequestWhereInput | VerificationRequestWhereInput[]
    OR?: VerificationRequestWhereInput[]
    NOT?: VerificationRequestWhereInput | VerificationRequestWhereInput[]
    customerEmail?: StringFilter<"VerificationRequest"> | string
    expiresAt?: DateTimeFilter<"VerificationRequest"> | Date | string
    usedAt?: DateTimeNullableFilter<"VerificationRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"VerificationRequest"> | Date | string
    receipt?: XOR<WorkReceiptScalarRelationFilter, WorkReceiptWhereInput>
  }, "id" | "receiptId" | "tokenHash">

  export type VerificationRequestOrderByWithAggregationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    tokenHash?: SortOrder
    customerEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: VerificationRequestCountOrderByAggregateInput
    _max?: VerificationRequestMaxOrderByAggregateInput
    _min?: VerificationRequestMinOrderByAggregateInput
  }

  export type VerificationRequestScalarWhereWithAggregatesInput = {
    AND?: VerificationRequestScalarWhereWithAggregatesInput | VerificationRequestScalarWhereWithAggregatesInput[]
    OR?: VerificationRequestScalarWhereWithAggregatesInput[]
    NOT?: VerificationRequestScalarWhereWithAggregatesInput | VerificationRequestScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"VerificationRequest"> | string
    receiptId?: UuidWithAggregatesFilter<"VerificationRequest"> | string
    tokenHash?: StringWithAggregatesFilter<"VerificationRequest"> | string
    customerEmail?: StringWithAggregatesFilter<"VerificationRequest"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"VerificationRequest"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"VerificationRequest"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"VerificationRequest"> | Date | string
  }

  export type ConfirmationWhereInput = {
    AND?: ConfirmationWhereInput | ConfirmationWhereInput[]
    OR?: ConfirmationWhereInput[]
    NOT?: ConfirmationWhereInput | ConfirmationWhereInput[]
    id?: UuidFilter<"Confirmation"> | string
    receiptId?: UuidFilter<"Confirmation"> | string
    decision?: EnumConfirmationDecisionFilter<"Confirmation"> | $Enums.ConfirmationDecision
    customerName?: StringFilter<"Confirmation"> | string
    customerEmail?: StringFilter<"Confirmation"> | string
    comment?: StringNullableFilter<"Confirmation"> | string | null
    confirmedAt?: DateTimeFilter<"Confirmation"> | Date | string
    ipAddress?: StringNullableFilter<"Confirmation"> | string | null
    userAgent?: StringNullableFilter<"Confirmation"> | string | null
    receipt?: XOR<WorkReceiptScalarRelationFilter, WorkReceiptWhereInput>
  }

  export type ConfirmationOrderByWithRelationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    decision?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    comment?: SortOrderInput | SortOrder
    confirmedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    receipt?: WorkReceiptOrderByWithRelationInput
  }

  export type ConfirmationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    receiptId?: string
    AND?: ConfirmationWhereInput | ConfirmationWhereInput[]
    OR?: ConfirmationWhereInput[]
    NOT?: ConfirmationWhereInput | ConfirmationWhereInput[]
    decision?: EnumConfirmationDecisionFilter<"Confirmation"> | $Enums.ConfirmationDecision
    customerName?: StringFilter<"Confirmation"> | string
    customerEmail?: StringFilter<"Confirmation"> | string
    comment?: StringNullableFilter<"Confirmation"> | string | null
    confirmedAt?: DateTimeFilter<"Confirmation"> | Date | string
    ipAddress?: StringNullableFilter<"Confirmation"> | string | null
    userAgent?: StringNullableFilter<"Confirmation"> | string | null
    receipt?: XOR<WorkReceiptScalarRelationFilter, WorkReceiptWhereInput>
  }, "id" | "receiptId">

  export type ConfirmationOrderByWithAggregationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    decision?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    comment?: SortOrderInput | SortOrder
    confirmedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    _count?: ConfirmationCountOrderByAggregateInput
    _max?: ConfirmationMaxOrderByAggregateInput
    _min?: ConfirmationMinOrderByAggregateInput
  }

  export type ConfirmationScalarWhereWithAggregatesInput = {
    AND?: ConfirmationScalarWhereWithAggregatesInput | ConfirmationScalarWhereWithAggregatesInput[]
    OR?: ConfirmationScalarWhereWithAggregatesInput[]
    NOT?: ConfirmationScalarWhereWithAggregatesInput | ConfirmationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Confirmation"> | string
    receiptId?: UuidWithAggregatesFilter<"Confirmation"> | string
    decision?: EnumConfirmationDecisionWithAggregatesFilter<"Confirmation"> | $Enums.ConfirmationDecision
    customerName?: StringWithAggregatesFilter<"Confirmation"> | string
    customerEmail?: StringWithAggregatesFilter<"Confirmation"> | string
    comment?: StringNullableWithAggregatesFilter<"Confirmation"> | string | null
    confirmedAt?: DateTimeWithAggregatesFilter<"Confirmation"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Confirmation"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Confirmation"> | string | null
  }

  export type DisputeWhereInput = {
    AND?: DisputeWhereInput | DisputeWhereInput[]
    OR?: DisputeWhereInput[]
    NOT?: DisputeWhereInput | DisputeWhereInput[]
    id?: UuidFilter<"Dispute"> | string
    receiptId?: UuidFilter<"Dispute"> | string
    reason?: StringFilter<"Dispute"> | string
    description?: StringFilter<"Dispute"> | string
    status?: EnumDisputeStatusFilter<"Dispute"> | $Enums.DisputeStatus
    resolution?: StringNullableFilter<"Dispute"> | string | null
    openedAt?: DateTimeFilter<"Dispute"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"Dispute"> | Date | string | null
    receipt?: XOR<WorkReceiptScalarRelationFilter, WorkReceiptWhereInput>
  }

  export type DisputeOrderByWithRelationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    reason?: SortOrder
    description?: SortOrder
    status?: SortOrder
    resolution?: SortOrderInput | SortOrder
    openedAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    receipt?: WorkReceiptOrderByWithRelationInput
  }

  export type DisputeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    receiptId?: string
    AND?: DisputeWhereInput | DisputeWhereInput[]
    OR?: DisputeWhereInput[]
    NOT?: DisputeWhereInput | DisputeWhereInput[]
    reason?: StringFilter<"Dispute"> | string
    description?: StringFilter<"Dispute"> | string
    status?: EnumDisputeStatusFilter<"Dispute"> | $Enums.DisputeStatus
    resolution?: StringNullableFilter<"Dispute"> | string | null
    openedAt?: DateTimeFilter<"Dispute"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"Dispute"> | Date | string | null
    receipt?: XOR<WorkReceiptScalarRelationFilter, WorkReceiptWhereInput>
  }, "id" | "receiptId">

  export type DisputeOrderByWithAggregationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    reason?: SortOrder
    description?: SortOrder
    status?: SortOrder
    resolution?: SortOrderInput | SortOrder
    openedAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    _count?: DisputeCountOrderByAggregateInput
    _max?: DisputeMaxOrderByAggregateInput
    _min?: DisputeMinOrderByAggregateInput
  }

  export type DisputeScalarWhereWithAggregatesInput = {
    AND?: DisputeScalarWhereWithAggregatesInput | DisputeScalarWhereWithAggregatesInput[]
    OR?: DisputeScalarWhereWithAggregatesInput[]
    NOT?: DisputeScalarWhereWithAggregatesInput | DisputeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Dispute"> | string
    receiptId?: UuidWithAggregatesFilter<"Dispute"> | string
    reason?: StringWithAggregatesFilter<"Dispute"> | string
    description?: StringWithAggregatesFilter<"Dispute"> | string
    status?: EnumDisputeStatusWithAggregatesFilter<"Dispute"> | $Enums.DisputeStatus
    resolution?: StringNullableWithAggregatesFilter<"Dispute"> | string | null
    openedAt?: DateTimeWithAggregatesFilter<"Dispute"> | Date | string
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Dispute"> | Date | string | null
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: UuidFilter<"AuditLog"> | string
    actorId?: UuidNullableFilter<"AuditLog"> | string | null
    receiptId?: UuidNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    metadata?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    actor?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    receipt?: XOR<WorkReceiptNullableScalarRelationFilter, WorkReceiptWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    actorId?: SortOrderInput | SortOrder
    receiptId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    actor?: UserOrderByWithRelationInput
    receipt?: WorkReceiptOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    actorId?: UuidNullableFilter<"AuditLog"> | string | null
    receiptId?: UuidNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    metadata?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    actor?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    receipt?: XOR<WorkReceiptNullableScalarRelationFilter, WorkReceiptWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    actorId?: SortOrderInput | SortOrder
    receiptId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AuditLog"> | string
    actorId?: UuidNullableWithAggregatesFilter<"AuditLog"> | string | null
    receiptId?: UuidNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entityType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringWithAggregatesFilter<"AuditLog"> | string
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    workerProfile?: WorkerProfileCreateNestedOneWithoutUserInput
    organisation?: OrganisationCreateNestedOneWithoutOwnerInput
    receipts?: WorkReceiptCreateNestedManyWithoutWorkerInput
    auditLogs?: AuditLogCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    workerProfile?: WorkerProfileUncheckedCreateNestedOneWithoutUserInput
    organisation?: OrganisationUncheckedCreateNestedOneWithoutOwnerInput
    receipts?: WorkReceiptUncheckedCreateNestedManyWithoutWorkerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workerProfile?: WorkerProfileUpdateOneWithoutUserNestedInput
    organisation?: OrganisationUpdateOneWithoutOwnerNestedInput
    receipts?: WorkReceiptUpdateManyWithoutWorkerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workerProfile?: WorkerProfileUncheckedUpdateOneWithoutUserNestedInput
    organisation?: OrganisationUncheckedUpdateOneWithoutOwnerNestedInput
    receipts?: WorkReceiptUncheckedUpdateManyWithoutWorkerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutActorNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerProfileCreateInput = {
    id?: string
    headline?: string | null
    bio?: string | null
    location?: string | null
    phone?: string | null
    skills?: WorkerProfileCreateskillsInput | string[]
    profileSlug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWorkerProfileInput
  }

  export type WorkerProfileUncheckedCreateInput = {
    id?: string
    userId: string
    headline?: string | null
    bio?: string | null
    location?: string | null
    phone?: string | null
    skills?: WorkerProfileCreateskillsInput | string[]
    profileSlug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkerProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: WorkerProfileUpdateskillsInput | string[]
    profileSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWorkerProfileNestedInput
  }

  export type WorkerProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: WorkerProfileUpdateskillsInput | string[]
    profileSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerProfileCreateManyInput = {
    id?: string
    userId: string
    headline?: string | null
    bio?: string | null
    location?: string | null
    phone?: string | null
    skills?: WorkerProfileCreateskillsInput | string[]
    profileSlug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkerProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: WorkerProfileUpdateskillsInput | string[]
    profileSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: WorkerProfileUpdateskillsInput | string[]
    profileSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationCreateInput = {
    id?: string
    name: string
    description?: string | null
    website?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOrganisationInput
  }

  export type OrganisationUncheckedCreateInput = {
    id?: string
    ownerId: string
    name: string
    description?: string | null
    website?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOrganisationNestedInput
  }

  export type OrganisationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationCreateManyInput = {
    id?: string
    ownerId: string
    name: string
    description?: string | null
    website?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkReceiptCreateInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    worker: UserCreateNestedOneWithoutReceiptsInput
    evidence?: EvidenceCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationCreateNestedOneWithoutReceiptInput
    dispute?: DisputeCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptUncheckedCreateInput = {
    id?: string
    receiptNumber?: string | null
    workerId: string
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: EvidenceUncheckedCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestUncheckedCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationUncheckedCreateNestedOneWithoutReceiptInput
    dispute?: DisputeUncheckedCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: UserUpdateOneRequiredWithoutReceiptsNestedInput
    evidence?: EvidenceUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    workerId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceUncheckedUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUncheckedUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUncheckedUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUncheckedUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptCreateManyInput = {
    id?: string
    receiptNumber?: string | null
    workerId: string
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkReceiptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkReceiptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    workerId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceCreateInput = {
    id?: string
    type: $Enums.EvidenceType
    url: string
    originalFilename?: string | null
    mimeType?: string | null
    size?: number | null
    description?: string | null
    createdAt?: Date | string
    receipt: WorkReceiptCreateNestedOneWithoutEvidenceInput
  }

  export type EvidenceUncheckedCreateInput = {
    id?: string
    receiptId: string
    type: $Enums.EvidenceType
    url: string
    originalFilename?: string | null
    mimeType?: string | null
    size?: number | null
    description?: string | null
    createdAt?: Date | string
  }

  export type EvidenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEvidenceTypeFieldUpdateOperationsInput | $Enums.EvidenceType
    url?: StringFieldUpdateOperationsInput | string
    originalFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receipt?: WorkReceiptUpdateOneRequiredWithoutEvidenceNestedInput
  }

  export type EvidenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    type?: EnumEvidenceTypeFieldUpdateOperationsInput | $Enums.EvidenceType
    url?: StringFieldUpdateOperationsInput | string
    originalFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceCreateManyInput = {
    id?: string
    receiptId: string
    type: $Enums.EvidenceType
    url: string
    originalFilename?: string | null
    mimeType?: string | null
    size?: number | null
    description?: string | null
    createdAt?: Date | string
  }

  export type EvidenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEvidenceTypeFieldUpdateOperationsInput | $Enums.EvidenceType
    url?: StringFieldUpdateOperationsInput | string
    originalFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    type?: EnumEvidenceTypeFieldUpdateOperationsInput | $Enums.EvidenceType
    url?: StringFieldUpdateOperationsInput | string
    originalFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationRequestCreateInput = {
    id?: string
    tokenHash: string
    customerEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    receipt: WorkReceiptCreateNestedOneWithoutVerificationRequestInput
  }

  export type VerificationRequestUncheckedCreateInput = {
    id?: string
    receiptId: string
    tokenHash: string
    customerEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type VerificationRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receipt?: WorkReceiptUpdateOneRequiredWithoutVerificationRequestNestedInput
  }

  export type VerificationRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationRequestCreateManyInput = {
    id?: string
    receiptId: string
    tokenHash: string
    customerEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type VerificationRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmationCreateInput = {
    id?: string
    decision: $Enums.ConfirmationDecision
    customerName: string
    customerEmail: string
    comment?: string | null
    confirmedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    receipt: WorkReceiptCreateNestedOneWithoutConfirmationInput
  }

  export type ConfirmationUncheckedCreateInput = {
    id?: string
    receiptId: string
    decision: $Enums.ConfirmationDecision
    customerName: string
    customerEmail: string
    comment?: string | null
    confirmedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type ConfirmationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    decision?: EnumConfirmationDecisionFieldUpdateOperationsInput | $Enums.ConfirmationDecision
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    receipt?: WorkReceiptUpdateOneRequiredWithoutConfirmationNestedInput
  }

  export type ConfirmationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    decision?: EnumConfirmationDecisionFieldUpdateOperationsInput | $Enums.ConfirmationDecision
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConfirmationCreateManyInput = {
    id?: string
    receiptId: string
    decision: $Enums.ConfirmationDecision
    customerName: string
    customerEmail: string
    comment?: string | null
    confirmedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type ConfirmationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    decision?: EnumConfirmationDecisionFieldUpdateOperationsInput | $Enums.ConfirmationDecision
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConfirmationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    decision?: EnumConfirmationDecisionFieldUpdateOperationsInput | $Enums.ConfirmationDecision
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DisputeCreateInput = {
    id?: string
    reason: string
    description: string
    status?: $Enums.DisputeStatus
    resolution?: string | null
    openedAt?: Date | string
    resolvedAt?: Date | string | null
    receipt: WorkReceiptCreateNestedOneWithoutDisputeInput
  }

  export type DisputeUncheckedCreateInput = {
    id?: string
    receiptId: string
    reason: string
    description: string
    status?: $Enums.DisputeStatus
    resolution?: string | null
    openedAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type DisputeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receipt?: WorkReceiptUpdateOneRequiredWithoutDisputeNestedInput
  }

  export type DisputeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DisputeCreateManyInput = {
    id?: string
    receiptId: string
    reason: string
    description: string
    status?: $Enums.DisputeStatus
    resolution?: string | null
    openedAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type DisputeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DisputeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogCreateInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
    actor?: UserCreateNestedOneWithoutAuditLogsInput
    receipt?: WorkReceiptCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    actorId?: string | null
    receiptId?: string | null
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actor?: UserUpdateOneWithoutAuditLogsNestedInput
    receipt?: WorkReceiptUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    receiptId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    actorId?: string | null
    receiptId?: string | null
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    receiptId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type WorkerProfileNullableScalarRelationFilter = {
    is?: WorkerProfileWhereInput | null
    isNot?: WorkerProfileWhereInput | null
  }

  export type OrganisationNullableScalarRelationFilter = {
    is?: OrganisationWhereInput | null
    isNot?: OrganisationWhereInput | null
  }

  export type WorkReceiptListRelationFilter = {
    every?: WorkReceiptWhereInput
    some?: WorkReceiptWhereInput
    none?: WorkReceiptWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type WorkReceiptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WorkerProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    headline?: SortOrder
    bio?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    skills?: SortOrder
    profileSlug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkerProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    headline?: SortOrder
    bio?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    profileSlug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkerProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    headline?: SortOrder
    bio?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    profileSlug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type OrganisationCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    website?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    website?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    website?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumReceiptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReceiptStatus | EnumReceiptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReceiptStatus[] | ListEnumReceiptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReceiptStatus[] | ListEnumReceiptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReceiptStatusFilter<$PrismaModel> | $Enums.ReceiptStatus
  }

  export type EnumVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.Visibility | EnumVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumVisibilityFilter<$PrismaModel> | $Enums.Visibility
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EvidenceListRelationFilter = {
    every?: EvidenceWhereInput
    some?: EvidenceWhereInput
    none?: EvidenceWhereInput
  }

  export type VerificationRequestNullableScalarRelationFilter = {
    is?: VerificationRequestWhereInput | null
    isNot?: VerificationRequestWhereInput | null
  }

  export type ConfirmationNullableScalarRelationFilter = {
    is?: ConfirmationWhereInput | null
    isNot?: ConfirmationWhereInput | null
  }

  export type DisputeNullableScalarRelationFilter = {
    is?: DisputeWhereInput | null
    isNot?: DisputeWhereInput | null
  }

  export type EvidenceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkReceiptCountOrderByAggregateInput = {
    id?: SortOrder
    receiptNumber?: SortOrder
    workerId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    serviceTitle?: SortOrder
    description?: SortOrder
    workDate?: SortOrder
    durationMinutes?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    skillsDemonstrated?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    verificationCode?: SortOrder
    integrityHash?: SortOrder
    submittedAt?: SortOrder
    verifiedAt?: SortOrder
    lockedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkReceiptAvgOrderByAggregateInput = {
    durationMinutes?: SortOrder
    amount?: SortOrder
  }

  export type WorkReceiptMaxOrderByAggregateInput = {
    id?: SortOrder
    receiptNumber?: SortOrder
    workerId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    serviceTitle?: SortOrder
    description?: SortOrder
    workDate?: SortOrder
    durationMinutes?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    verificationCode?: SortOrder
    integrityHash?: SortOrder
    submittedAt?: SortOrder
    verifiedAt?: SortOrder
    lockedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkReceiptMinOrderByAggregateInput = {
    id?: SortOrder
    receiptNumber?: SortOrder
    workerId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    serviceTitle?: SortOrder
    description?: SortOrder
    workDate?: SortOrder
    durationMinutes?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    verificationCode?: SortOrder
    integrityHash?: SortOrder
    submittedAt?: SortOrder
    verifiedAt?: SortOrder
    lockedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkReceiptSumOrderByAggregateInput = {
    durationMinutes?: SortOrder
    amount?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumReceiptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReceiptStatus | EnumReceiptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReceiptStatus[] | ListEnumReceiptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReceiptStatus[] | ListEnumReceiptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReceiptStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReceiptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReceiptStatusFilter<$PrismaModel>
    _max?: NestedEnumReceiptStatusFilter<$PrismaModel>
  }

  export type EnumVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Visibility | EnumVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.Visibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisibilityFilter<$PrismaModel>
    _max?: NestedEnumVisibilityFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumEvidenceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceType | EnumEvidenceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceType[] | ListEnumEvidenceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceType[] | ListEnumEvidenceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceTypeFilter<$PrismaModel> | $Enums.EvidenceType
  }

  export type WorkReceiptScalarRelationFilter = {
    is?: WorkReceiptWhereInput
    isNot?: WorkReceiptWhereInput
  }

  export type EvidenceCountOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    type?: SortOrder
    url?: SortOrder
    originalFilename?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type EvidenceAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type EvidenceMaxOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    type?: SortOrder
    url?: SortOrder
    originalFilename?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type EvidenceMinOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    type?: SortOrder
    url?: SortOrder
    originalFilename?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type EvidenceSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type EnumEvidenceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceType | EnumEvidenceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceType[] | ListEnumEvidenceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceType[] | ListEnumEvidenceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceTypeWithAggregatesFilter<$PrismaModel> | $Enums.EvidenceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEvidenceTypeFilter<$PrismaModel>
    _max?: NestedEnumEvidenceTypeFilter<$PrismaModel>
  }

  export type VerificationRequestCountOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    tokenHash?: SortOrder
    customerEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VerificationRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    tokenHash?: SortOrder
    customerEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VerificationRequestMinOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    tokenHash?: SortOrder
    customerEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumConfirmationDecisionFilter<$PrismaModel = never> = {
    equals?: $Enums.ConfirmationDecision | EnumConfirmationDecisionFieldRefInput<$PrismaModel>
    in?: $Enums.ConfirmationDecision[] | ListEnumConfirmationDecisionFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConfirmationDecision[] | ListEnumConfirmationDecisionFieldRefInput<$PrismaModel>
    not?: NestedEnumConfirmationDecisionFilter<$PrismaModel> | $Enums.ConfirmationDecision
  }

  export type ConfirmationCountOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    decision?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    comment?: SortOrder
    confirmedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type ConfirmationMaxOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    decision?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    comment?: SortOrder
    confirmedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type ConfirmationMinOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    decision?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    comment?: SortOrder
    confirmedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type EnumConfirmationDecisionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConfirmationDecision | EnumConfirmationDecisionFieldRefInput<$PrismaModel>
    in?: $Enums.ConfirmationDecision[] | ListEnumConfirmationDecisionFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConfirmationDecision[] | ListEnumConfirmationDecisionFieldRefInput<$PrismaModel>
    not?: NestedEnumConfirmationDecisionWithAggregatesFilter<$PrismaModel> | $Enums.ConfirmationDecision
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConfirmationDecisionFilter<$PrismaModel>
    _max?: NestedEnumConfirmationDecisionFilter<$PrismaModel>
  }

  export type EnumDisputeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | EnumDisputeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDisputeStatusFilter<$PrismaModel> | $Enums.DisputeStatus
  }

  export type DisputeCountOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    reason?: SortOrder
    description?: SortOrder
    status?: SortOrder
    resolution?: SortOrder
    openedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type DisputeMaxOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    reason?: SortOrder
    description?: SortOrder
    status?: SortOrder
    resolution?: SortOrder
    openedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type DisputeMinOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    reason?: SortOrder
    description?: SortOrder
    status?: SortOrder
    resolution?: SortOrder
    openedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type EnumDisputeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | EnumDisputeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDisputeStatusWithAggregatesFilter<$PrismaModel> | $Enums.DisputeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDisputeStatusFilter<$PrismaModel>
    _max?: NestedEnumDisputeStatusFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type WorkReceiptNullableScalarRelationFilter = {
    is?: WorkReceiptWhereInput | null
    isNot?: WorkReceiptWhereInput | null
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    receiptId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    metadata?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    receiptId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    receiptId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type WorkerProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<WorkerProfileCreateWithoutUserInput, WorkerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkerProfileCreateOrConnectWithoutUserInput
    connect?: WorkerProfileWhereUniqueInput
  }

  export type OrganisationCreateNestedOneWithoutOwnerInput = {
    create?: XOR<OrganisationCreateWithoutOwnerInput, OrganisationUncheckedCreateWithoutOwnerInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutOwnerInput
    connect?: OrganisationWhereUniqueInput
  }

  export type WorkReceiptCreateNestedManyWithoutWorkerInput = {
    create?: XOR<WorkReceiptCreateWithoutWorkerInput, WorkReceiptUncheckedCreateWithoutWorkerInput> | WorkReceiptCreateWithoutWorkerInput[] | WorkReceiptUncheckedCreateWithoutWorkerInput[]
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutWorkerInput | WorkReceiptCreateOrConnectWithoutWorkerInput[]
    createMany?: WorkReceiptCreateManyWorkerInputEnvelope
    connect?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutActorInput = {
    create?: XOR<AuditLogCreateWithoutActorInput, AuditLogUncheckedCreateWithoutActorInput> | AuditLogCreateWithoutActorInput[] | AuditLogUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutActorInput | AuditLogCreateOrConnectWithoutActorInput[]
    createMany?: AuditLogCreateManyActorInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type WorkerProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<WorkerProfileCreateWithoutUserInput, WorkerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkerProfileCreateOrConnectWithoutUserInput
    connect?: WorkerProfileWhereUniqueInput
  }

  export type OrganisationUncheckedCreateNestedOneWithoutOwnerInput = {
    create?: XOR<OrganisationCreateWithoutOwnerInput, OrganisationUncheckedCreateWithoutOwnerInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutOwnerInput
    connect?: OrganisationWhereUniqueInput
  }

  export type WorkReceiptUncheckedCreateNestedManyWithoutWorkerInput = {
    create?: XOR<WorkReceiptCreateWithoutWorkerInput, WorkReceiptUncheckedCreateWithoutWorkerInput> | WorkReceiptCreateWithoutWorkerInput[] | WorkReceiptUncheckedCreateWithoutWorkerInput[]
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutWorkerInput | WorkReceiptCreateOrConnectWithoutWorkerInput[]
    createMany?: WorkReceiptCreateManyWorkerInputEnvelope
    connect?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutActorInput = {
    create?: XOR<AuditLogCreateWithoutActorInput, AuditLogUncheckedCreateWithoutActorInput> | AuditLogCreateWithoutActorInput[] | AuditLogUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutActorInput | AuditLogCreateOrConnectWithoutActorInput[]
    createMany?: AuditLogCreateManyActorInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type WorkerProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<WorkerProfileCreateWithoutUserInput, WorkerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkerProfileCreateOrConnectWithoutUserInput
    upsert?: WorkerProfileUpsertWithoutUserInput
    disconnect?: WorkerProfileWhereInput | boolean
    delete?: WorkerProfileWhereInput | boolean
    connect?: WorkerProfileWhereUniqueInput
    update?: XOR<XOR<WorkerProfileUpdateToOneWithWhereWithoutUserInput, WorkerProfileUpdateWithoutUserInput>, WorkerProfileUncheckedUpdateWithoutUserInput>
  }

  export type OrganisationUpdateOneWithoutOwnerNestedInput = {
    create?: XOR<OrganisationCreateWithoutOwnerInput, OrganisationUncheckedCreateWithoutOwnerInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutOwnerInput
    upsert?: OrganisationUpsertWithoutOwnerInput
    disconnect?: OrganisationWhereInput | boolean
    delete?: OrganisationWhereInput | boolean
    connect?: OrganisationWhereUniqueInput
    update?: XOR<XOR<OrganisationUpdateToOneWithWhereWithoutOwnerInput, OrganisationUpdateWithoutOwnerInput>, OrganisationUncheckedUpdateWithoutOwnerInput>
  }

  export type WorkReceiptUpdateManyWithoutWorkerNestedInput = {
    create?: XOR<WorkReceiptCreateWithoutWorkerInput, WorkReceiptUncheckedCreateWithoutWorkerInput> | WorkReceiptCreateWithoutWorkerInput[] | WorkReceiptUncheckedCreateWithoutWorkerInput[]
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutWorkerInput | WorkReceiptCreateOrConnectWithoutWorkerInput[]
    upsert?: WorkReceiptUpsertWithWhereUniqueWithoutWorkerInput | WorkReceiptUpsertWithWhereUniqueWithoutWorkerInput[]
    createMany?: WorkReceiptCreateManyWorkerInputEnvelope
    set?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
    disconnect?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
    delete?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
    connect?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
    update?: WorkReceiptUpdateWithWhereUniqueWithoutWorkerInput | WorkReceiptUpdateWithWhereUniqueWithoutWorkerInput[]
    updateMany?: WorkReceiptUpdateManyWithWhereWithoutWorkerInput | WorkReceiptUpdateManyWithWhereWithoutWorkerInput[]
    deleteMany?: WorkReceiptScalarWhereInput | WorkReceiptScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutActorNestedInput = {
    create?: XOR<AuditLogCreateWithoutActorInput, AuditLogUncheckedCreateWithoutActorInput> | AuditLogCreateWithoutActorInput[] | AuditLogUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutActorInput | AuditLogCreateOrConnectWithoutActorInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutActorInput | AuditLogUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: AuditLogCreateManyActorInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutActorInput | AuditLogUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutActorInput | AuditLogUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type WorkerProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<WorkerProfileCreateWithoutUserInput, WorkerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkerProfileCreateOrConnectWithoutUserInput
    upsert?: WorkerProfileUpsertWithoutUserInput
    disconnect?: WorkerProfileWhereInput | boolean
    delete?: WorkerProfileWhereInput | boolean
    connect?: WorkerProfileWhereUniqueInput
    update?: XOR<XOR<WorkerProfileUpdateToOneWithWhereWithoutUserInput, WorkerProfileUpdateWithoutUserInput>, WorkerProfileUncheckedUpdateWithoutUserInput>
  }

  export type OrganisationUncheckedUpdateOneWithoutOwnerNestedInput = {
    create?: XOR<OrganisationCreateWithoutOwnerInput, OrganisationUncheckedCreateWithoutOwnerInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutOwnerInput
    upsert?: OrganisationUpsertWithoutOwnerInput
    disconnect?: OrganisationWhereInput | boolean
    delete?: OrganisationWhereInput | boolean
    connect?: OrganisationWhereUniqueInput
    update?: XOR<XOR<OrganisationUpdateToOneWithWhereWithoutOwnerInput, OrganisationUpdateWithoutOwnerInput>, OrganisationUncheckedUpdateWithoutOwnerInput>
  }

  export type WorkReceiptUncheckedUpdateManyWithoutWorkerNestedInput = {
    create?: XOR<WorkReceiptCreateWithoutWorkerInput, WorkReceiptUncheckedCreateWithoutWorkerInput> | WorkReceiptCreateWithoutWorkerInput[] | WorkReceiptUncheckedCreateWithoutWorkerInput[]
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutWorkerInput | WorkReceiptCreateOrConnectWithoutWorkerInput[]
    upsert?: WorkReceiptUpsertWithWhereUniqueWithoutWorkerInput | WorkReceiptUpsertWithWhereUniqueWithoutWorkerInput[]
    createMany?: WorkReceiptCreateManyWorkerInputEnvelope
    set?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
    disconnect?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
    delete?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
    connect?: WorkReceiptWhereUniqueInput | WorkReceiptWhereUniqueInput[]
    update?: WorkReceiptUpdateWithWhereUniqueWithoutWorkerInput | WorkReceiptUpdateWithWhereUniqueWithoutWorkerInput[]
    updateMany?: WorkReceiptUpdateManyWithWhereWithoutWorkerInput | WorkReceiptUpdateManyWithWhereWithoutWorkerInput[]
    deleteMany?: WorkReceiptScalarWhereInput | WorkReceiptScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutActorNestedInput = {
    create?: XOR<AuditLogCreateWithoutActorInput, AuditLogUncheckedCreateWithoutActorInput> | AuditLogCreateWithoutActorInput[] | AuditLogUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutActorInput | AuditLogCreateOrConnectWithoutActorInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutActorInput | AuditLogUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: AuditLogCreateManyActorInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutActorInput | AuditLogUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutActorInput | AuditLogUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type WorkerProfileCreateskillsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutWorkerProfileInput = {
    create?: XOR<UserCreateWithoutWorkerProfileInput, UserUncheckedCreateWithoutWorkerProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkerProfileInput
    connect?: UserWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type WorkerProfileUpdateskillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutWorkerProfileNestedInput = {
    create?: XOR<UserCreateWithoutWorkerProfileInput, UserUncheckedCreateWithoutWorkerProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkerProfileInput
    upsert?: UserUpsertWithoutWorkerProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWorkerProfileInput, UserUpdateWithoutWorkerProfileInput>, UserUncheckedUpdateWithoutWorkerProfileInput>
  }

  export type UserCreateNestedOneWithoutOrganisationInput = {
    create?: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrganisationInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutOrganisationNestedInput = {
    create?: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrganisationInput
    upsert?: UserUpsertWithoutOrganisationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrganisationInput, UserUpdateWithoutOrganisationInput>, UserUncheckedUpdateWithoutOrganisationInput>
  }

  export type WorkReceiptCreateskillsDemonstratedInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutReceiptsInput = {
    create?: XOR<UserCreateWithoutReceiptsInput, UserUncheckedCreateWithoutReceiptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceiptsInput
    connect?: UserWhereUniqueInput
  }

  export type EvidenceCreateNestedManyWithoutReceiptInput = {
    create?: XOR<EvidenceCreateWithoutReceiptInput, EvidenceUncheckedCreateWithoutReceiptInput> | EvidenceCreateWithoutReceiptInput[] | EvidenceUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: EvidenceCreateOrConnectWithoutReceiptInput | EvidenceCreateOrConnectWithoutReceiptInput[]
    createMany?: EvidenceCreateManyReceiptInputEnvelope
    connect?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
  }

  export type VerificationRequestCreateNestedOneWithoutReceiptInput = {
    create?: XOR<VerificationRequestCreateWithoutReceiptInput, VerificationRequestUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: VerificationRequestCreateOrConnectWithoutReceiptInput
    connect?: VerificationRequestWhereUniqueInput
  }

  export type ConfirmationCreateNestedOneWithoutReceiptInput = {
    create?: XOR<ConfirmationCreateWithoutReceiptInput, ConfirmationUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: ConfirmationCreateOrConnectWithoutReceiptInput
    connect?: ConfirmationWhereUniqueInput
  }

  export type DisputeCreateNestedOneWithoutReceiptInput = {
    create?: XOR<DisputeCreateWithoutReceiptInput, DisputeUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: DisputeCreateOrConnectWithoutReceiptInput
    connect?: DisputeWhereUniqueInput
  }

  export type AuditLogCreateNestedManyWithoutReceiptInput = {
    create?: XOR<AuditLogCreateWithoutReceiptInput, AuditLogUncheckedCreateWithoutReceiptInput> | AuditLogCreateWithoutReceiptInput[] | AuditLogUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutReceiptInput | AuditLogCreateOrConnectWithoutReceiptInput[]
    createMany?: AuditLogCreateManyReceiptInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type EvidenceUncheckedCreateNestedManyWithoutReceiptInput = {
    create?: XOR<EvidenceCreateWithoutReceiptInput, EvidenceUncheckedCreateWithoutReceiptInput> | EvidenceCreateWithoutReceiptInput[] | EvidenceUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: EvidenceCreateOrConnectWithoutReceiptInput | EvidenceCreateOrConnectWithoutReceiptInput[]
    createMany?: EvidenceCreateManyReceiptInputEnvelope
    connect?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
  }

  export type VerificationRequestUncheckedCreateNestedOneWithoutReceiptInput = {
    create?: XOR<VerificationRequestCreateWithoutReceiptInput, VerificationRequestUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: VerificationRequestCreateOrConnectWithoutReceiptInput
    connect?: VerificationRequestWhereUniqueInput
  }

  export type ConfirmationUncheckedCreateNestedOneWithoutReceiptInput = {
    create?: XOR<ConfirmationCreateWithoutReceiptInput, ConfirmationUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: ConfirmationCreateOrConnectWithoutReceiptInput
    connect?: ConfirmationWhereUniqueInput
  }

  export type DisputeUncheckedCreateNestedOneWithoutReceiptInput = {
    create?: XOR<DisputeCreateWithoutReceiptInput, DisputeUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: DisputeCreateOrConnectWithoutReceiptInput
    connect?: DisputeWhereUniqueInput
  }

  export type AuditLogUncheckedCreateNestedManyWithoutReceiptInput = {
    create?: XOR<AuditLogCreateWithoutReceiptInput, AuditLogUncheckedCreateWithoutReceiptInput> | AuditLogCreateWithoutReceiptInput[] | AuditLogUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutReceiptInput | AuditLogCreateOrConnectWithoutReceiptInput[]
    createMany?: AuditLogCreateManyReceiptInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type WorkReceiptUpdateskillsDemonstratedInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumReceiptStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReceiptStatus
  }

  export type EnumVisibilityFieldUpdateOperationsInput = {
    set?: $Enums.Visibility
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutReceiptsNestedInput = {
    create?: XOR<UserCreateWithoutReceiptsInput, UserUncheckedCreateWithoutReceiptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceiptsInput
    upsert?: UserUpsertWithoutReceiptsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceiptsInput, UserUpdateWithoutReceiptsInput>, UserUncheckedUpdateWithoutReceiptsInput>
  }

  export type EvidenceUpdateManyWithoutReceiptNestedInput = {
    create?: XOR<EvidenceCreateWithoutReceiptInput, EvidenceUncheckedCreateWithoutReceiptInput> | EvidenceCreateWithoutReceiptInput[] | EvidenceUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: EvidenceCreateOrConnectWithoutReceiptInput | EvidenceCreateOrConnectWithoutReceiptInput[]
    upsert?: EvidenceUpsertWithWhereUniqueWithoutReceiptInput | EvidenceUpsertWithWhereUniqueWithoutReceiptInput[]
    createMany?: EvidenceCreateManyReceiptInputEnvelope
    set?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
    disconnect?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
    delete?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
    connect?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
    update?: EvidenceUpdateWithWhereUniqueWithoutReceiptInput | EvidenceUpdateWithWhereUniqueWithoutReceiptInput[]
    updateMany?: EvidenceUpdateManyWithWhereWithoutReceiptInput | EvidenceUpdateManyWithWhereWithoutReceiptInput[]
    deleteMany?: EvidenceScalarWhereInput | EvidenceScalarWhereInput[]
  }

  export type VerificationRequestUpdateOneWithoutReceiptNestedInput = {
    create?: XOR<VerificationRequestCreateWithoutReceiptInput, VerificationRequestUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: VerificationRequestCreateOrConnectWithoutReceiptInput
    upsert?: VerificationRequestUpsertWithoutReceiptInput
    disconnect?: VerificationRequestWhereInput | boolean
    delete?: VerificationRequestWhereInput | boolean
    connect?: VerificationRequestWhereUniqueInput
    update?: XOR<XOR<VerificationRequestUpdateToOneWithWhereWithoutReceiptInput, VerificationRequestUpdateWithoutReceiptInput>, VerificationRequestUncheckedUpdateWithoutReceiptInput>
  }

  export type ConfirmationUpdateOneWithoutReceiptNestedInput = {
    create?: XOR<ConfirmationCreateWithoutReceiptInput, ConfirmationUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: ConfirmationCreateOrConnectWithoutReceiptInput
    upsert?: ConfirmationUpsertWithoutReceiptInput
    disconnect?: ConfirmationWhereInput | boolean
    delete?: ConfirmationWhereInput | boolean
    connect?: ConfirmationWhereUniqueInput
    update?: XOR<XOR<ConfirmationUpdateToOneWithWhereWithoutReceiptInput, ConfirmationUpdateWithoutReceiptInput>, ConfirmationUncheckedUpdateWithoutReceiptInput>
  }

  export type DisputeUpdateOneWithoutReceiptNestedInput = {
    create?: XOR<DisputeCreateWithoutReceiptInput, DisputeUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: DisputeCreateOrConnectWithoutReceiptInput
    upsert?: DisputeUpsertWithoutReceiptInput
    disconnect?: DisputeWhereInput | boolean
    delete?: DisputeWhereInput | boolean
    connect?: DisputeWhereUniqueInput
    update?: XOR<XOR<DisputeUpdateToOneWithWhereWithoutReceiptInput, DisputeUpdateWithoutReceiptInput>, DisputeUncheckedUpdateWithoutReceiptInput>
  }

  export type AuditLogUpdateManyWithoutReceiptNestedInput = {
    create?: XOR<AuditLogCreateWithoutReceiptInput, AuditLogUncheckedCreateWithoutReceiptInput> | AuditLogCreateWithoutReceiptInput[] | AuditLogUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutReceiptInput | AuditLogCreateOrConnectWithoutReceiptInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutReceiptInput | AuditLogUpsertWithWhereUniqueWithoutReceiptInput[]
    createMany?: AuditLogCreateManyReceiptInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutReceiptInput | AuditLogUpdateWithWhereUniqueWithoutReceiptInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutReceiptInput | AuditLogUpdateManyWithWhereWithoutReceiptInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type EvidenceUncheckedUpdateManyWithoutReceiptNestedInput = {
    create?: XOR<EvidenceCreateWithoutReceiptInput, EvidenceUncheckedCreateWithoutReceiptInput> | EvidenceCreateWithoutReceiptInput[] | EvidenceUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: EvidenceCreateOrConnectWithoutReceiptInput | EvidenceCreateOrConnectWithoutReceiptInput[]
    upsert?: EvidenceUpsertWithWhereUniqueWithoutReceiptInput | EvidenceUpsertWithWhereUniqueWithoutReceiptInput[]
    createMany?: EvidenceCreateManyReceiptInputEnvelope
    set?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
    disconnect?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
    delete?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
    connect?: EvidenceWhereUniqueInput | EvidenceWhereUniqueInput[]
    update?: EvidenceUpdateWithWhereUniqueWithoutReceiptInput | EvidenceUpdateWithWhereUniqueWithoutReceiptInput[]
    updateMany?: EvidenceUpdateManyWithWhereWithoutReceiptInput | EvidenceUpdateManyWithWhereWithoutReceiptInput[]
    deleteMany?: EvidenceScalarWhereInput | EvidenceScalarWhereInput[]
  }

  export type VerificationRequestUncheckedUpdateOneWithoutReceiptNestedInput = {
    create?: XOR<VerificationRequestCreateWithoutReceiptInput, VerificationRequestUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: VerificationRequestCreateOrConnectWithoutReceiptInput
    upsert?: VerificationRequestUpsertWithoutReceiptInput
    disconnect?: VerificationRequestWhereInput | boolean
    delete?: VerificationRequestWhereInput | boolean
    connect?: VerificationRequestWhereUniqueInput
    update?: XOR<XOR<VerificationRequestUpdateToOneWithWhereWithoutReceiptInput, VerificationRequestUpdateWithoutReceiptInput>, VerificationRequestUncheckedUpdateWithoutReceiptInput>
  }

  export type ConfirmationUncheckedUpdateOneWithoutReceiptNestedInput = {
    create?: XOR<ConfirmationCreateWithoutReceiptInput, ConfirmationUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: ConfirmationCreateOrConnectWithoutReceiptInput
    upsert?: ConfirmationUpsertWithoutReceiptInput
    disconnect?: ConfirmationWhereInput | boolean
    delete?: ConfirmationWhereInput | boolean
    connect?: ConfirmationWhereUniqueInput
    update?: XOR<XOR<ConfirmationUpdateToOneWithWhereWithoutReceiptInput, ConfirmationUpdateWithoutReceiptInput>, ConfirmationUncheckedUpdateWithoutReceiptInput>
  }

  export type DisputeUncheckedUpdateOneWithoutReceiptNestedInput = {
    create?: XOR<DisputeCreateWithoutReceiptInput, DisputeUncheckedCreateWithoutReceiptInput>
    connectOrCreate?: DisputeCreateOrConnectWithoutReceiptInput
    upsert?: DisputeUpsertWithoutReceiptInput
    disconnect?: DisputeWhereInput | boolean
    delete?: DisputeWhereInput | boolean
    connect?: DisputeWhereUniqueInput
    update?: XOR<XOR<DisputeUpdateToOneWithWhereWithoutReceiptInput, DisputeUpdateWithoutReceiptInput>, DisputeUncheckedUpdateWithoutReceiptInput>
  }

  export type AuditLogUncheckedUpdateManyWithoutReceiptNestedInput = {
    create?: XOR<AuditLogCreateWithoutReceiptInput, AuditLogUncheckedCreateWithoutReceiptInput> | AuditLogCreateWithoutReceiptInput[] | AuditLogUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutReceiptInput | AuditLogCreateOrConnectWithoutReceiptInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutReceiptInput | AuditLogUpsertWithWhereUniqueWithoutReceiptInput[]
    createMany?: AuditLogCreateManyReceiptInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutReceiptInput | AuditLogUpdateWithWhereUniqueWithoutReceiptInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutReceiptInput | AuditLogUpdateManyWithWhereWithoutReceiptInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type WorkReceiptCreateNestedOneWithoutEvidenceInput = {
    create?: XOR<WorkReceiptCreateWithoutEvidenceInput, WorkReceiptUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutEvidenceInput
    connect?: WorkReceiptWhereUniqueInput
  }

  export type EnumEvidenceTypeFieldUpdateOperationsInput = {
    set?: $Enums.EvidenceType
  }

  export type WorkReceiptUpdateOneRequiredWithoutEvidenceNestedInput = {
    create?: XOR<WorkReceiptCreateWithoutEvidenceInput, WorkReceiptUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutEvidenceInput
    upsert?: WorkReceiptUpsertWithoutEvidenceInput
    connect?: WorkReceiptWhereUniqueInput
    update?: XOR<XOR<WorkReceiptUpdateToOneWithWhereWithoutEvidenceInput, WorkReceiptUpdateWithoutEvidenceInput>, WorkReceiptUncheckedUpdateWithoutEvidenceInput>
  }

  export type WorkReceiptCreateNestedOneWithoutVerificationRequestInput = {
    create?: XOR<WorkReceiptCreateWithoutVerificationRequestInput, WorkReceiptUncheckedCreateWithoutVerificationRequestInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutVerificationRequestInput
    connect?: WorkReceiptWhereUniqueInput
  }

  export type WorkReceiptUpdateOneRequiredWithoutVerificationRequestNestedInput = {
    create?: XOR<WorkReceiptCreateWithoutVerificationRequestInput, WorkReceiptUncheckedCreateWithoutVerificationRequestInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutVerificationRequestInput
    upsert?: WorkReceiptUpsertWithoutVerificationRequestInput
    connect?: WorkReceiptWhereUniqueInput
    update?: XOR<XOR<WorkReceiptUpdateToOneWithWhereWithoutVerificationRequestInput, WorkReceiptUpdateWithoutVerificationRequestInput>, WorkReceiptUncheckedUpdateWithoutVerificationRequestInput>
  }

  export type WorkReceiptCreateNestedOneWithoutConfirmationInput = {
    create?: XOR<WorkReceiptCreateWithoutConfirmationInput, WorkReceiptUncheckedCreateWithoutConfirmationInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutConfirmationInput
    connect?: WorkReceiptWhereUniqueInput
  }

  export type EnumConfirmationDecisionFieldUpdateOperationsInput = {
    set?: $Enums.ConfirmationDecision
  }

  export type WorkReceiptUpdateOneRequiredWithoutConfirmationNestedInput = {
    create?: XOR<WorkReceiptCreateWithoutConfirmationInput, WorkReceiptUncheckedCreateWithoutConfirmationInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutConfirmationInput
    upsert?: WorkReceiptUpsertWithoutConfirmationInput
    connect?: WorkReceiptWhereUniqueInput
    update?: XOR<XOR<WorkReceiptUpdateToOneWithWhereWithoutConfirmationInput, WorkReceiptUpdateWithoutConfirmationInput>, WorkReceiptUncheckedUpdateWithoutConfirmationInput>
  }

  export type WorkReceiptCreateNestedOneWithoutDisputeInput = {
    create?: XOR<WorkReceiptCreateWithoutDisputeInput, WorkReceiptUncheckedCreateWithoutDisputeInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutDisputeInput
    connect?: WorkReceiptWhereUniqueInput
  }

  export type EnumDisputeStatusFieldUpdateOperationsInput = {
    set?: $Enums.DisputeStatus
  }

  export type WorkReceiptUpdateOneRequiredWithoutDisputeNestedInput = {
    create?: XOR<WorkReceiptCreateWithoutDisputeInput, WorkReceiptUncheckedCreateWithoutDisputeInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutDisputeInput
    upsert?: WorkReceiptUpsertWithoutDisputeInput
    connect?: WorkReceiptWhereUniqueInput
    update?: XOR<XOR<WorkReceiptUpdateToOneWithWhereWithoutDisputeInput, WorkReceiptUpdateWithoutDisputeInput>, WorkReceiptUncheckedUpdateWithoutDisputeInput>
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type WorkReceiptCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<WorkReceiptCreateWithoutAuditLogsInput, WorkReceiptUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutAuditLogsInput
    connect?: WorkReceiptWhereUniqueInput
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type WorkReceiptUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<WorkReceiptCreateWithoutAuditLogsInput, WorkReceiptUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: WorkReceiptCreateOrConnectWithoutAuditLogsInput
    upsert?: WorkReceiptUpsertWithoutAuditLogsInput
    disconnect?: WorkReceiptWhereInput | boolean
    delete?: WorkReceiptWhereInput | boolean
    connect?: WorkReceiptWhereUniqueInput
    update?: XOR<XOR<WorkReceiptUpdateToOneWithWhereWithoutAuditLogsInput, WorkReceiptUpdateWithoutAuditLogsInput>, WorkReceiptUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumReceiptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReceiptStatus | EnumReceiptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReceiptStatus[] | ListEnumReceiptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReceiptStatus[] | ListEnumReceiptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReceiptStatusFilter<$PrismaModel> | $Enums.ReceiptStatus
  }

  export type NestedEnumVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.Visibility | EnumVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumVisibilityFilter<$PrismaModel> | $Enums.Visibility
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumReceiptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReceiptStatus | EnumReceiptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReceiptStatus[] | ListEnumReceiptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReceiptStatus[] | ListEnumReceiptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReceiptStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReceiptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReceiptStatusFilter<$PrismaModel>
    _max?: NestedEnumReceiptStatusFilter<$PrismaModel>
  }

  export type NestedEnumVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Visibility | EnumVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.Visibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisibilityFilter<$PrismaModel>
    _max?: NestedEnumVisibilityFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumEvidenceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceType | EnumEvidenceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceType[] | ListEnumEvidenceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceType[] | ListEnumEvidenceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceTypeFilter<$PrismaModel> | $Enums.EvidenceType
  }

  export type NestedEnumEvidenceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceType | EnumEvidenceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceType[] | ListEnumEvidenceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceType[] | ListEnumEvidenceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceTypeWithAggregatesFilter<$PrismaModel> | $Enums.EvidenceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEvidenceTypeFilter<$PrismaModel>
    _max?: NestedEnumEvidenceTypeFilter<$PrismaModel>
  }

  export type NestedEnumConfirmationDecisionFilter<$PrismaModel = never> = {
    equals?: $Enums.ConfirmationDecision | EnumConfirmationDecisionFieldRefInput<$PrismaModel>
    in?: $Enums.ConfirmationDecision[] | ListEnumConfirmationDecisionFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConfirmationDecision[] | ListEnumConfirmationDecisionFieldRefInput<$PrismaModel>
    not?: NestedEnumConfirmationDecisionFilter<$PrismaModel> | $Enums.ConfirmationDecision
  }

  export type NestedEnumConfirmationDecisionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConfirmationDecision | EnumConfirmationDecisionFieldRefInput<$PrismaModel>
    in?: $Enums.ConfirmationDecision[] | ListEnumConfirmationDecisionFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConfirmationDecision[] | ListEnumConfirmationDecisionFieldRefInput<$PrismaModel>
    not?: NestedEnumConfirmationDecisionWithAggregatesFilter<$PrismaModel> | $Enums.ConfirmationDecision
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConfirmationDecisionFilter<$PrismaModel>
    _max?: NestedEnumConfirmationDecisionFilter<$PrismaModel>
  }

  export type NestedEnumDisputeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | EnumDisputeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDisputeStatusFilter<$PrismaModel> | $Enums.DisputeStatus
  }

  export type NestedEnumDisputeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | EnumDisputeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDisputeStatusWithAggregatesFilter<$PrismaModel> | $Enums.DisputeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDisputeStatusFilter<$PrismaModel>
    _max?: NestedEnumDisputeStatusFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type WorkerProfileCreateWithoutUserInput = {
    id?: string
    headline?: string | null
    bio?: string | null
    location?: string | null
    phone?: string | null
    skills?: WorkerProfileCreateskillsInput | string[]
    profileSlug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkerProfileUncheckedCreateWithoutUserInput = {
    id?: string
    headline?: string | null
    bio?: string | null
    location?: string | null
    phone?: string | null
    skills?: WorkerProfileCreateskillsInput | string[]
    profileSlug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkerProfileCreateOrConnectWithoutUserInput = {
    where: WorkerProfileWhereUniqueInput
    create: XOR<WorkerProfileCreateWithoutUserInput, WorkerProfileUncheckedCreateWithoutUserInput>
  }

  export type OrganisationCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    website?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    website?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationCreateOrConnectWithoutOwnerInput = {
    where: OrganisationWhereUniqueInput
    create: XOR<OrganisationCreateWithoutOwnerInput, OrganisationUncheckedCreateWithoutOwnerInput>
  }

  export type WorkReceiptCreateWithoutWorkerInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: EvidenceCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationCreateNestedOneWithoutReceiptInput
    dispute?: DisputeCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptUncheckedCreateWithoutWorkerInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: EvidenceUncheckedCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestUncheckedCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationUncheckedCreateNestedOneWithoutReceiptInput
    dispute?: DisputeUncheckedCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptCreateOrConnectWithoutWorkerInput = {
    where: WorkReceiptWhereUniqueInput
    create: XOR<WorkReceiptCreateWithoutWorkerInput, WorkReceiptUncheckedCreateWithoutWorkerInput>
  }

  export type WorkReceiptCreateManyWorkerInputEnvelope = {
    data: WorkReceiptCreateManyWorkerInput | WorkReceiptCreateManyWorkerInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutActorInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
    receipt?: WorkReceiptCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutActorInput = {
    id?: string
    receiptId?: string | null
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutActorInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutActorInput, AuditLogUncheckedCreateWithoutActorInput>
  }

  export type AuditLogCreateManyActorInputEnvelope = {
    data: AuditLogCreateManyActorInput | AuditLogCreateManyActorInput[]
    skipDuplicates?: boolean
  }

  export type WorkerProfileUpsertWithoutUserInput = {
    update: XOR<WorkerProfileUpdateWithoutUserInput, WorkerProfileUncheckedUpdateWithoutUserInput>
    create: XOR<WorkerProfileCreateWithoutUserInput, WorkerProfileUncheckedCreateWithoutUserInput>
    where?: WorkerProfileWhereInput
  }

  export type WorkerProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: WorkerProfileWhereInput
    data: XOR<WorkerProfileUpdateWithoutUserInput, WorkerProfileUncheckedUpdateWithoutUserInput>
  }

  export type WorkerProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: WorkerProfileUpdateskillsInput | string[]
    profileSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: WorkerProfileUpdateskillsInput | string[]
    profileSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUpsertWithoutOwnerInput = {
    update: XOR<OrganisationUpdateWithoutOwnerInput, OrganisationUncheckedUpdateWithoutOwnerInput>
    create: XOR<OrganisationCreateWithoutOwnerInput, OrganisationUncheckedCreateWithoutOwnerInput>
    where?: OrganisationWhereInput
  }

  export type OrganisationUpdateToOneWithWhereWithoutOwnerInput = {
    where?: OrganisationWhereInput
    data: XOR<OrganisationUpdateWithoutOwnerInput, OrganisationUncheckedUpdateWithoutOwnerInput>
  }

  export type OrganisationUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkReceiptUpsertWithWhereUniqueWithoutWorkerInput = {
    where: WorkReceiptWhereUniqueInput
    update: XOR<WorkReceiptUpdateWithoutWorkerInput, WorkReceiptUncheckedUpdateWithoutWorkerInput>
    create: XOR<WorkReceiptCreateWithoutWorkerInput, WorkReceiptUncheckedCreateWithoutWorkerInput>
  }

  export type WorkReceiptUpdateWithWhereUniqueWithoutWorkerInput = {
    where: WorkReceiptWhereUniqueInput
    data: XOR<WorkReceiptUpdateWithoutWorkerInput, WorkReceiptUncheckedUpdateWithoutWorkerInput>
  }

  export type WorkReceiptUpdateManyWithWhereWithoutWorkerInput = {
    where: WorkReceiptScalarWhereInput
    data: XOR<WorkReceiptUpdateManyMutationInput, WorkReceiptUncheckedUpdateManyWithoutWorkerInput>
  }

  export type WorkReceiptScalarWhereInput = {
    AND?: WorkReceiptScalarWhereInput | WorkReceiptScalarWhereInput[]
    OR?: WorkReceiptScalarWhereInput[]
    NOT?: WorkReceiptScalarWhereInput | WorkReceiptScalarWhereInput[]
    id?: UuidFilter<"WorkReceipt"> | string
    receiptNumber?: StringNullableFilter<"WorkReceipt"> | string | null
    workerId?: UuidFilter<"WorkReceipt"> | string
    customerName?: StringFilter<"WorkReceipt"> | string
    customerEmail?: StringFilter<"WorkReceipt"> | string
    customerPhone?: StringNullableFilter<"WorkReceipt"> | string | null
    serviceTitle?: StringFilter<"WorkReceipt"> | string
    description?: StringFilter<"WorkReceipt"> | string
    workDate?: DateTimeFilter<"WorkReceipt"> | Date | string
    durationMinutes?: IntNullableFilter<"WorkReceipt"> | number | null
    amount?: DecimalNullableFilter<"WorkReceipt"> | Decimal | DecimalJsLike | number | string | null
    currency?: StringFilter<"WorkReceipt"> | string
    skillsDemonstrated?: StringNullableListFilter<"WorkReceipt">
    status?: EnumReceiptStatusFilter<"WorkReceipt"> | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFilter<"WorkReceipt"> | $Enums.Visibility
    verificationCode?: StringNullableFilter<"WorkReceipt"> | string | null
    integrityHash?: StringNullableFilter<"WorkReceipt"> | string | null
    submittedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    verifiedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    lockedAt?: DateTimeNullableFilter<"WorkReceipt"> | Date | string | null
    createdAt?: DateTimeFilter<"WorkReceipt"> | Date | string
    updatedAt?: DateTimeFilter<"WorkReceipt"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutActorInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutActorInput, AuditLogUncheckedUpdateWithoutActorInput>
    create: XOR<AuditLogCreateWithoutActorInput, AuditLogUncheckedCreateWithoutActorInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutActorInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutActorInput, AuditLogUncheckedUpdateWithoutActorInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutActorInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutActorInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: UuidFilter<"AuditLog"> | string
    actorId?: UuidNullableFilter<"AuditLog"> | string | null
    receiptId?: UuidNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    metadata?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type UserCreateWithoutWorkerProfileInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    organisation?: OrganisationCreateNestedOneWithoutOwnerInput
    receipts?: WorkReceiptCreateNestedManyWithoutWorkerInput
    auditLogs?: AuditLogCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutWorkerProfileInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    organisation?: OrganisationUncheckedCreateNestedOneWithoutOwnerInput
    receipts?: WorkReceiptUncheckedCreateNestedManyWithoutWorkerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutWorkerProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWorkerProfileInput, UserUncheckedCreateWithoutWorkerProfileInput>
  }

  export type UserUpsertWithoutWorkerProfileInput = {
    update: XOR<UserUpdateWithoutWorkerProfileInput, UserUncheckedUpdateWithoutWorkerProfileInput>
    create: XOR<UserCreateWithoutWorkerProfileInput, UserUncheckedCreateWithoutWorkerProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWorkerProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWorkerProfileInput, UserUncheckedUpdateWithoutWorkerProfileInput>
  }

  export type UserUpdateWithoutWorkerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisation?: OrganisationUpdateOneWithoutOwnerNestedInput
    receipts?: WorkReceiptUpdateManyWithoutWorkerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutWorkerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisation?: OrganisationUncheckedUpdateOneWithoutOwnerNestedInput
    receipts?: WorkReceiptUncheckedUpdateManyWithoutWorkerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutActorNestedInput
  }

  export type UserCreateWithoutOrganisationInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    workerProfile?: WorkerProfileCreateNestedOneWithoutUserInput
    receipts?: WorkReceiptCreateNestedManyWithoutWorkerInput
    auditLogs?: AuditLogCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutOrganisationInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    workerProfile?: WorkerProfileUncheckedCreateNestedOneWithoutUserInput
    receipts?: WorkReceiptUncheckedCreateNestedManyWithoutWorkerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutOrganisationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput>
  }

  export type UserUpsertWithoutOrganisationInput = {
    update: XOR<UserUpdateWithoutOrganisationInput, UserUncheckedUpdateWithoutOrganisationInput>
    create: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrganisationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrganisationInput, UserUncheckedUpdateWithoutOrganisationInput>
  }

  export type UserUpdateWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workerProfile?: WorkerProfileUpdateOneWithoutUserNestedInput
    receipts?: WorkReceiptUpdateManyWithoutWorkerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workerProfile?: WorkerProfileUncheckedUpdateOneWithoutUserNestedInput
    receipts?: WorkReceiptUncheckedUpdateManyWithoutWorkerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutActorNestedInput
  }

  export type UserCreateWithoutReceiptsInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    workerProfile?: WorkerProfileCreateNestedOneWithoutUserInput
    organisation?: OrganisationCreateNestedOneWithoutOwnerInput
    auditLogs?: AuditLogCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutReceiptsInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    workerProfile?: WorkerProfileUncheckedCreateNestedOneWithoutUserInput
    organisation?: OrganisationUncheckedCreateNestedOneWithoutOwnerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutReceiptsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceiptsInput, UserUncheckedCreateWithoutReceiptsInput>
  }

  export type EvidenceCreateWithoutReceiptInput = {
    id?: string
    type: $Enums.EvidenceType
    url: string
    originalFilename?: string | null
    mimeType?: string | null
    size?: number | null
    description?: string | null
    createdAt?: Date | string
  }

  export type EvidenceUncheckedCreateWithoutReceiptInput = {
    id?: string
    type: $Enums.EvidenceType
    url: string
    originalFilename?: string | null
    mimeType?: string | null
    size?: number | null
    description?: string | null
    createdAt?: Date | string
  }

  export type EvidenceCreateOrConnectWithoutReceiptInput = {
    where: EvidenceWhereUniqueInput
    create: XOR<EvidenceCreateWithoutReceiptInput, EvidenceUncheckedCreateWithoutReceiptInput>
  }

  export type EvidenceCreateManyReceiptInputEnvelope = {
    data: EvidenceCreateManyReceiptInput | EvidenceCreateManyReceiptInput[]
    skipDuplicates?: boolean
  }

  export type VerificationRequestCreateWithoutReceiptInput = {
    id?: string
    tokenHash: string
    customerEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type VerificationRequestUncheckedCreateWithoutReceiptInput = {
    id?: string
    tokenHash: string
    customerEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type VerificationRequestCreateOrConnectWithoutReceiptInput = {
    where: VerificationRequestWhereUniqueInput
    create: XOR<VerificationRequestCreateWithoutReceiptInput, VerificationRequestUncheckedCreateWithoutReceiptInput>
  }

  export type ConfirmationCreateWithoutReceiptInput = {
    id?: string
    decision: $Enums.ConfirmationDecision
    customerName: string
    customerEmail: string
    comment?: string | null
    confirmedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type ConfirmationUncheckedCreateWithoutReceiptInput = {
    id?: string
    decision: $Enums.ConfirmationDecision
    customerName: string
    customerEmail: string
    comment?: string | null
    confirmedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type ConfirmationCreateOrConnectWithoutReceiptInput = {
    where: ConfirmationWhereUniqueInput
    create: XOR<ConfirmationCreateWithoutReceiptInput, ConfirmationUncheckedCreateWithoutReceiptInput>
  }

  export type DisputeCreateWithoutReceiptInput = {
    id?: string
    reason: string
    description: string
    status?: $Enums.DisputeStatus
    resolution?: string | null
    openedAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type DisputeUncheckedCreateWithoutReceiptInput = {
    id?: string
    reason: string
    description: string
    status?: $Enums.DisputeStatus
    resolution?: string | null
    openedAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type DisputeCreateOrConnectWithoutReceiptInput = {
    where: DisputeWhereUniqueInput
    create: XOR<DisputeCreateWithoutReceiptInput, DisputeUncheckedCreateWithoutReceiptInput>
  }

  export type AuditLogCreateWithoutReceiptInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
    actor?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutReceiptInput = {
    id?: string
    actorId?: string | null
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutReceiptInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutReceiptInput, AuditLogUncheckedCreateWithoutReceiptInput>
  }

  export type AuditLogCreateManyReceiptInputEnvelope = {
    data: AuditLogCreateManyReceiptInput | AuditLogCreateManyReceiptInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutReceiptsInput = {
    update: XOR<UserUpdateWithoutReceiptsInput, UserUncheckedUpdateWithoutReceiptsInput>
    create: XOR<UserCreateWithoutReceiptsInput, UserUncheckedCreateWithoutReceiptsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceiptsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceiptsInput, UserUncheckedUpdateWithoutReceiptsInput>
  }

  export type UserUpdateWithoutReceiptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workerProfile?: WorkerProfileUpdateOneWithoutUserNestedInput
    organisation?: OrganisationUpdateOneWithoutOwnerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutReceiptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workerProfile?: WorkerProfileUncheckedUpdateOneWithoutUserNestedInput
    organisation?: OrganisationUncheckedUpdateOneWithoutOwnerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutActorNestedInput
  }

  export type EvidenceUpsertWithWhereUniqueWithoutReceiptInput = {
    where: EvidenceWhereUniqueInput
    update: XOR<EvidenceUpdateWithoutReceiptInput, EvidenceUncheckedUpdateWithoutReceiptInput>
    create: XOR<EvidenceCreateWithoutReceiptInput, EvidenceUncheckedCreateWithoutReceiptInput>
  }

  export type EvidenceUpdateWithWhereUniqueWithoutReceiptInput = {
    where: EvidenceWhereUniqueInput
    data: XOR<EvidenceUpdateWithoutReceiptInput, EvidenceUncheckedUpdateWithoutReceiptInput>
  }

  export type EvidenceUpdateManyWithWhereWithoutReceiptInput = {
    where: EvidenceScalarWhereInput
    data: XOR<EvidenceUpdateManyMutationInput, EvidenceUncheckedUpdateManyWithoutReceiptInput>
  }

  export type EvidenceScalarWhereInput = {
    AND?: EvidenceScalarWhereInput | EvidenceScalarWhereInput[]
    OR?: EvidenceScalarWhereInput[]
    NOT?: EvidenceScalarWhereInput | EvidenceScalarWhereInput[]
    id?: UuidFilter<"Evidence"> | string
    receiptId?: UuidFilter<"Evidence"> | string
    type?: EnumEvidenceTypeFilter<"Evidence"> | $Enums.EvidenceType
    url?: StringFilter<"Evidence"> | string
    originalFilename?: StringNullableFilter<"Evidence"> | string | null
    mimeType?: StringNullableFilter<"Evidence"> | string | null
    size?: IntNullableFilter<"Evidence"> | number | null
    description?: StringNullableFilter<"Evidence"> | string | null
    createdAt?: DateTimeFilter<"Evidence"> | Date | string
  }

  export type VerificationRequestUpsertWithoutReceiptInput = {
    update: XOR<VerificationRequestUpdateWithoutReceiptInput, VerificationRequestUncheckedUpdateWithoutReceiptInput>
    create: XOR<VerificationRequestCreateWithoutReceiptInput, VerificationRequestUncheckedCreateWithoutReceiptInput>
    where?: VerificationRequestWhereInput
  }

  export type VerificationRequestUpdateToOneWithWhereWithoutReceiptInput = {
    where?: VerificationRequestWhereInput
    data: XOR<VerificationRequestUpdateWithoutReceiptInput, VerificationRequestUncheckedUpdateWithoutReceiptInput>
  }

  export type VerificationRequestUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationRequestUncheckedUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfirmationUpsertWithoutReceiptInput = {
    update: XOR<ConfirmationUpdateWithoutReceiptInput, ConfirmationUncheckedUpdateWithoutReceiptInput>
    create: XOR<ConfirmationCreateWithoutReceiptInput, ConfirmationUncheckedCreateWithoutReceiptInput>
    where?: ConfirmationWhereInput
  }

  export type ConfirmationUpdateToOneWithWhereWithoutReceiptInput = {
    where?: ConfirmationWhereInput
    data: XOR<ConfirmationUpdateWithoutReceiptInput, ConfirmationUncheckedUpdateWithoutReceiptInput>
  }

  export type ConfirmationUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    decision?: EnumConfirmationDecisionFieldUpdateOperationsInput | $Enums.ConfirmationDecision
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConfirmationUncheckedUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    decision?: EnumConfirmationDecisionFieldUpdateOperationsInput | $Enums.ConfirmationDecision
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DisputeUpsertWithoutReceiptInput = {
    update: XOR<DisputeUpdateWithoutReceiptInput, DisputeUncheckedUpdateWithoutReceiptInput>
    create: XOR<DisputeCreateWithoutReceiptInput, DisputeUncheckedCreateWithoutReceiptInput>
    where?: DisputeWhereInput
  }

  export type DisputeUpdateToOneWithWhereWithoutReceiptInput = {
    where?: DisputeWhereInput
    data: XOR<DisputeUpdateWithoutReceiptInput, DisputeUncheckedUpdateWithoutReceiptInput>
  }

  export type DisputeUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DisputeUncheckedUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUpsertWithWhereUniqueWithoutReceiptInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutReceiptInput, AuditLogUncheckedUpdateWithoutReceiptInput>
    create: XOR<AuditLogCreateWithoutReceiptInput, AuditLogUncheckedCreateWithoutReceiptInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutReceiptInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutReceiptInput, AuditLogUncheckedUpdateWithoutReceiptInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutReceiptInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutReceiptInput>
  }

  export type WorkReceiptCreateWithoutEvidenceInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    worker: UserCreateNestedOneWithoutReceiptsInput
    verificationRequest?: VerificationRequestCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationCreateNestedOneWithoutReceiptInput
    dispute?: DisputeCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptUncheckedCreateWithoutEvidenceInput = {
    id?: string
    receiptNumber?: string | null
    workerId: string
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    verificationRequest?: VerificationRequestUncheckedCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationUncheckedCreateNestedOneWithoutReceiptInput
    dispute?: DisputeUncheckedCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptCreateOrConnectWithoutEvidenceInput = {
    where: WorkReceiptWhereUniqueInput
    create: XOR<WorkReceiptCreateWithoutEvidenceInput, WorkReceiptUncheckedCreateWithoutEvidenceInput>
  }

  export type WorkReceiptUpsertWithoutEvidenceInput = {
    update: XOR<WorkReceiptUpdateWithoutEvidenceInput, WorkReceiptUncheckedUpdateWithoutEvidenceInput>
    create: XOR<WorkReceiptCreateWithoutEvidenceInput, WorkReceiptUncheckedCreateWithoutEvidenceInput>
    where?: WorkReceiptWhereInput
  }

  export type WorkReceiptUpdateToOneWithWhereWithoutEvidenceInput = {
    where?: WorkReceiptWhereInput
    data: XOR<WorkReceiptUpdateWithoutEvidenceInput, WorkReceiptUncheckedUpdateWithoutEvidenceInput>
  }

  export type WorkReceiptUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: UserUpdateOneRequiredWithoutReceiptsNestedInput
    verificationRequest?: VerificationRequestUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptUncheckedUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    workerId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verificationRequest?: VerificationRequestUncheckedUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUncheckedUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUncheckedUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptCreateWithoutVerificationRequestInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    worker: UserCreateNestedOneWithoutReceiptsInput
    evidence?: EvidenceCreateNestedManyWithoutReceiptInput
    confirmation?: ConfirmationCreateNestedOneWithoutReceiptInput
    dispute?: DisputeCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptUncheckedCreateWithoutVerificationRequestInput = {
    id?: string
    receiptNumber?: string | null
    workerId: string
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: EvidenceUncheckedCreateNestedManyWithoutReceiptInput
    confirmation?: ConfirmationUncheckedCreateNestedOneWithoutReceiptInput
    dispute?: DisputeUncheckedCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptCreateOrConnectWithoutVerificationRequestInput = {
    where: WorkReceiptWhereUniqueInput
    create: XOR<WorkReceiptCreateWithoutVerificationRequestInput, WorkReceiptUncheckedCreateWithoutVerificationRequestInput>
  }

  export type WorkReceiptUpsertWithoutVerificationRequestInput = {
    update: XOR<WorkReceiptUpdateWithoutVerificationRequestInput, WorkReceiptUncheckedUpdateWithoutVerificationRequestInput>
    create: XOR<WorkReceiptCreateWithoutVerificationRequestInput, WorkReceiptUncheckedCreateWithoutVerificationRequestInput>
    where?: WorkReceiptWhereInput
  }

  export type WorkReceiptUpdateToOneWithWhereWithoutVerificationRequestInput = {
    where?: WorkReceiptWhereInput
    data: XOR<WorkReceiptUpdateWithoutVerificationRequestInput, WorkReceiptUncheckedUpdateWithoutVerificationRequestInput>
  }

  export type WorkReceiptUpdateWithoutVerificationRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: UserUpdateOneRequiredWithoutReceiptsNestedInput
    evidence?: EvidenceUpdateManyWithoutReceiptNestedInput
    confirmation?: ConfirmationUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptUncheckedUpdateWithoutVerificationRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    workerId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceUncheckedUpdateManyWithoutReceiptNestedInput
    confirmation?: ConfirmationUncheckedUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUncheckedUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptCreateWithoutConfirmationInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    worker: UserCreateNestedOneWithoutReceiptsInput
    evidence?: EvidenceCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestCreateNestedOneWithoutReceiptInput
    dispute?: DisputeCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptUncheckedCreateWithoutConfirmationInput = {
    id?: string
    receiptNumber?: string | null
    workerId: string
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: EvidenceUncheckedCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestUncheckedCreateNestedOneWithoutReceiptInput
    dispute?: DisputeUncheckedCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptCreateOrConnectWithoutConfirmationInput = {
    where: WorkReceiptWhereUniqueInput
    create: XOR<WorkReceiptCreateWithoutConfirmationInput, WorkReceiptUncheckedCreateWithoutConfirmationInput>
  }

  export type WorkReceiptUpsertWithoutConfirmationInput = {
    update: XOR<WorkReceiptUpdateWithoutConfirmationInput, WorkReceiptUncheckedUpdateWithoutConfirmationInput>
    create: XOR<WorkReceiptCreateWithoutConfirmationInput, WorkReceiptUncheckedCreateWithoutConfirmationInput>
    where?: WorkReceiptWhereInput
  }

  export type WorkReceiptUpdateToOneWithWhereWithoutConfirmationInput = {
    where?: WorkReceiptWhereInput
    data: XOR<WorkReceiptUpdateWithoutConfirmationInput, WorkReceiptUncheckedUpdateWithoutConfirmationInput>
  }

  export type WorkReceiptUpdateWithoutConfirmationInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: UserUpdateOneRequiredWithoutReceiptsNestedInput
    evidence?: EvidenceUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptUncheckedUpdateWithoutConfirmationInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    workerId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceUncheckedUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUncheckedUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUncheckedUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptCreateWithoutDisputeInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    worker: UserCreateNestedOneWithoutReceiptsInput
    evidence?: EvidenceCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptUncheckedCreateWithoutDisputeInput = {
    id?: string
    receiptNumber?: string | null
    workerId: string
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: EvidenceUncheckedCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestUncheckedCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationUncheckedCreateNestedOneWithoutReceiptInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutReceiptInput
  }

  export type WorkReceiptCreateOrConnectWithoutDisputeInput = {
    where: WorkReceiptWhereUniqueInput
    create: XOR<WorkReceiptCreateWithoutDisputeInput, WorkReceiptUncheckedCreateWithoutDisputeInput>
  }

  export type WorkReceiptUpsertWithoutDisputeInput = {
    update: XOR<WorkReceiptUpdateWithoutDisputeInput, WorkReceiptUncheckedUpdateWithoutDisputeInput>
    create: XOR<WorkReceiptCreateWithoutDisputeInput, WorkReceiptUncheckedCreateWithoutDisputeInput>
    where?: WorkReceiptWhereInput
  }

  export type WorkReceiptUpdateToOneWithWhereWithoutDisputeInput = {
    where?: WorkReceiptWhereInput
    data: XOR<WorkReceiptUpdateWithoutDisputeInput, WorkReceiptUncheckedUpdateWithoutDisputeInput>
  }

  export type WorkReceiptUpdateWithoutDisputeInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: UserUpdateOneRequiredWithoutReceiptsNestedInput
    evidence?: EvidenceUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptUncheckedUpdateWithoutDisputeInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    workerId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceUncheckedUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUncheckedUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUncheckedUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutReceiptNestedInput
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    workerProfile?: WorkerProfileCreateNestedOneWithoutUserInput
    organisation?: OrganisationCreateNestedOneWithoutOwnerInput
    receipts?: WorkReceiptCreateNestedManyWithoutWorkerInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    workerProfile?: WorkerProfileUncheckedCreateNestedOneWithoutUserInput
    organisation?: OrganisationUncheckedCreateNestedOneWithoutOwnerInput
    receipts?: WorkReceiptUncheckedCreateNestedManyWithoutWorkerInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type WorkReceiptCreateWithoutAuditLogsInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    worker: UserCreateNestedOneWithoutReceiptsInput
    evidence?: EvidenceCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationCreateNestedOneWithoutReceiptInput
    dispute?: DisputeCreateNestedOneWithoutReceiptInput
  }

  export type WorkReceiptUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    receiptNumber?: string | null
    workerId: string
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: EvidenceUncheckedCreateNestedManyWithoutReceiptInput
    verificationRequest?: VerificationRequestUncheckedCreateNestedOneWithoutReceiptInput
    confirmation?: ConfirmationUncheckedCreateNestedOneWithoutReceiptInput
    dispute?: DisputeUncheckedCreateNestedOneWithoutReceiptInput
  }

  export type WorkReceiptCreateOrConnectWithoutAuditLogsInput = {
    where: WorkReceiptWhereUniqueInput
    create: XOR<WorkReceiptCreateWithoutAuditLogsInput, WorkReceiptUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workerProfile?: WorkerProfileUpdateOneWithoutUserNestedInput
    organisation?: OrganisationUpdateOneWithoutOwnerNestedInput
    receipts?: WorkReceiptUpdateManyWithoutWorkerNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workerProfile?: WorkerProfileUncheckedUpdateOneWithoutUserNestedInput
    organisation?: OrganisationUncheckedUpdateOneWithoutOwnerNestedInput
    receipts?: WorkReceiptUncheckedUpdateManyWithoutWorkerNestedInput
  }

  export type WorkReceiptUpsertWithoutAuditLogsInput = {
    update: XOR<WorkReceiptUpdateWithoutAuditLogsInput, WorkReceiptUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<WorkReceiptCreateWithoutAuditLogsInput, WorkReceiptUncheckedCreateWithoutAuditLogsInput>
    where?: WorkReceiptWhereInput
  }

  export type WorkReceiptUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: WorkReceiptWhereInput
    data: XOR<WorkReceiptUpdateWithoutAuditLogsInput, WorkReceiptUncheckedUpdateWithoutAuditLogsInput>
  }

  export type WorkReceiptUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: UserUpdateOneRequiredWithoutReceiptsNestedInput
    evidence?: EvidenceUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUpdateOneWithoutReceiptNestedInput
  }

  export type WorkReceiptUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    workerId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceUncheckedUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUncheckedUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUncheckedUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUncheckedUpdateOneWithoutReceiptNestedInput
  }

  export type WorkReceiptCreateManyWorkerInput = {
    id?: string
    receiptNumber?: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    serviceTitle: string
    description: string
    workDate: Date | string
    durationMinutes?: number | null
    amount?: Decimal | DecimalJsLike | number | string | null
    currency?: string
    skillsDemonstrated?: WorkReceiptCreateskillsDemonstratedInput | string[]
    status?: $Enums.ReceiptStatus
    visibility?: $Enums.Visibility
    verificationCode?: string | null
    integrityHash?: string | null
    submittedAt?: Date | string | null
    verifiedAt?: Date | string | null
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditLogCreateManyActorInput = {
    id?: string
    receiptId?: string | null
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type WorkReceiptUpdateWithoutWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptUncheckedUpdateWithoutWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceUncheckedUpdateManyWithoutReceiptNestedInput
    verificationRequest?: VerificationRequestUncheckedUpdateOneWithoutReceiptNestedInput
    confirmation?: ConfirmationUncheckedUpdateOneWithoutReceiptNestedInput
    dispute?: DisputeUncheckedUpdateOneWithoutReceiptNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutReceiptNestedInput
  }

  export type WorkReceiptUncheckedUpdateManyWithoutWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    serviceTitle?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workDate?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currency?: StringFieldUpdateOperationsInput | string
    skillsDemonstrated?: WorkReceiptUpdateskillsDemonstratedInput | string[]
    status?: EnumReceiptStatusFieldUpdateOperationsInput | $Enums.ReceiptStatus
    visibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    verificationCode?: NullableStringFieldUpdateOperationsInput | string | null
    integrityHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receipt?: WorkReceiptUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceCreateManyReceiptInput = {
    id?: string
    type: $Enums.EvidenceType
    url: string
    originalFilename?: string | null
    mimeType?: string | null
    size?: number | null
    description?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateManyReceiptInput = {
    id?: string
    actorId?: string | null
    action: string
    entityType: string
    entityId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type EvidenceUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEvidenceTypeFieldUpdateOperationsInput | $Enums.EvidenceType
    url?: StringFieldUpdateOperationsInput | string
    originalFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceUncheckedUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEvidenceTypeFieldUpdateOperationsInput | $Enums.EvidenceType
    url?: StringFieldUpdateOperationsInput | string
    originalFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceUncheckedUpdateManyWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEvidenceTypeFieldUpdateOperationsInput | $Enums.EvidenceType
    url?: StringFieldUpdateOperationsInput | string
    originalFilename?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actor?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}