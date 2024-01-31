export interface IKeyset {
  readonly public_key: string
  readonly private_key: string
}

export type TGetKeysHandler = () => Promise<IKeyset>
