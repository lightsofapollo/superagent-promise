import stream = require('stream');

declare namespace request {
  interface SuperAgent {
    (url: string): SuperAgentRequest;
    (method: string, url: string): SuperAgentRequest;
    agent(): SuperAgent;
    get(url: string): SuperAgentRequest;
    post(url: string): SuperAgentRequest;
    put(url: string): SuperAgentRequest;
    head(url: string): SuperAgentRequest;
    del(url: string): SuperAgentRequest;
    delete(url: string): SuperAgentRequest;
    options(url: string): SuperAgentRequest;
    trace(url: string): SuperAgentRequest;
    copy(url: string): SuperAgentRequest;
    lock(url: string): SuperAgentRequest;
    mkcol(url: string): SuperAgentRequest;
    move(url: string): SuperAgentRequest;
    purge(url: string): SuperAgentRequest;
    propfind(url: string): SuperAgentRequest;
    proppatch(url: string): SuperAgentRequest;
    unlock(url: string): SuperAgentRequest;
    report(url: string): SuperAgentRequest;
    mkactivity(url: string): SuperAgentRequest;
    checkout(url: string): SuperAgentRequest;
    merge(url: string): SuperAgentRequest;
    notify(url: string): SuperAgentRequest;
    subscribe(url: string): SuperAgentRequest;
    unsubscribe(url: string): SuperAgentRequest;
    patch(url: string): SuperAgentRequest;
    search(url: string): SuperAgentRequest;
    connect(url: string): SuperAgentRequest;

    parse(fn: Function): SuperAgentRequest;
    saveCookies(res: SuperAgentResponse): void;
    attachCookies(req: SuperAgentRequest): void;
  }

  interface SuperAgentResponse {
    text: string;
    body: any;
    files: any;
    header: any;
    type: string;
    charset: string;
    status: number;
    statusType: number;
    info: boolean;
    ok: boolean;
    redirect: boolean;
    clientError: boolean;
    serverError: boolean;
    error: Error;
    accepted: boolean;
    noContent: boolean;
    badRequest: boolean;
    unauthorized: boolean;
    notAcceptable: boolean;
    notFound: boolean;
    forbidden: boolean;
    get(header: string): string;
  }

  interface SuperAgentRequest {
    abort(): void;
    accept(type: string): SuperAgentRequest;
    attach(field: string, file: string, filename?: string): SuperAgentRequest;
    auth(user: string, name: string): SuperAgentRequest;
    buffer(val: boolean): SuperAgentRequest;
    clearTimeout(): SuperAgentRequest;
    field(name: string, val: string): SuperAgentRequest;
    get(field: string): string;
    on(name: string, handler: Function): SuperAgentRequest;
    on(name: 'error', handler: (err: any) => void): SuperAgentRequest;
    part(): SuperAgentRequest;
    pipe(stream: NodeJS.WritableStream, options?: Object): stream.Writable;
    query(val: Object): SuperAgentRequest;
    redirects(n: number): SuperAgentRequest;
    send(data: string): SuperAgentRequest;
    send(data: Object): SuperAgentRequest;
    send(): SuperAgentRequest;
    set(field: string, val: string): SuperAgentRequest;
    set(field: Object): SuperAgentRequest;
    timeout(ms: number): SuperAgentRequest;
    type(val: string): SuperAgentRequest;
    use(fn: Function): SuperAgentRequest;
    withCredentials(): SuperAgentRequest;
    write(buffer: Buffer|string, cb?: Function): boolean;
    write(str: string, encoding?: string, cb?: Function): boolean;

    end(): Promise<SuperAgentResponse>
  }
}

declare function request(superagent: any, promise: any): request.SuperAgent;

export = request;