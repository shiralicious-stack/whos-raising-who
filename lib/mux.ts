import Mux from '@mux/mux-node'

let _mux: Mux | null = null

export function getMux(): Mux {
  if (!_mux) {
    _mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID!,
      tokenSecret: process.env.MUX_TOKEN_SECRET!,
    })
  }
  return _mux
}

// Convenience proxy that behaves like the old `mux` export
export const mux = new Proxy({} as Mux, {
  get(_target, prop) {
    return (getMux() as never)[prop as keyof Mux]
  },
})
