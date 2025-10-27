export abstract class UseCase<Input, Output> {
  async execute(input: Input): Promise<Output> {
    await this.before(input);
    const validatedInput = await this.validate(input);
    const output = await this.run(validatedInput);
    await this.after(output);
    return output;
  }

  // Must be implemented by the concrete use case
  protected abstract run(i: Input): Promise<Output>;

  // Hooks: override if you need it

  protected async before(_i: Input): Promise<void> {}

  protected async validate(_i: Input): Promise<Input> {
    return _i;
  }

  protected async after(_o: Output): Promise<void> {}
}
