export interface IKeyset {
  public_key: string;
  private_key: string;
}

export type TGetKeysHandler = () => Promise<IKeyset>;