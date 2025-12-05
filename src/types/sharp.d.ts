declare module 'sharp' {
  namespace sharp {
    interface Sharp {
      grayscale(): Sharp;
      normalize(): Sharp;
      threshold(value: number, options?: { grayscale?: boolean }): Sharp;
      metadata(): Promise<{
        width?: number;
        height?: number;
        format?: string;
        channels?: number;
      }>;
      raw(): Sharp;
      toBuffer(options?: { resolveWithObject?: boolean }): Promise<any>;
    }
  }

  function sharp(input?: Buffer | string): sharp.Sharp;

  export = sharp;
}
