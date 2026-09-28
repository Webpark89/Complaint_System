import { type ObjectVisibility, type SignedURLOptions } from '@adonisjs/drive/types'

/**
 * The base set of options that are always needed to
 * create GCS driver instance
 */
export type FileApiDriverOptions = {
  /**
   * The bucket from which to read and write files
   */
  bucket: string

  endpoint: string
  client_id: string
  client_secret: string
  /**
   * The default visibility of all the files. The FSDriver
   * does not use visbility to implement any logic, instead
   * it returns the value as it is via the "getMetaData"
   * method
   */
  visibility: ObjectVisibility

  /**
   * Configure a custom URL builder for creating public and
   * temporary URLs
   */
  urlBuilder?: {
    /**
     * Custom implementation for creating public URLs
     */
    generateURL?(key: string, filePath: string): Promise<string>

    /**
     * Custom implementation for creating signed/temporary URLs
     */
    generateSignedURL?(key: string, filePath: string, options: SignedURLOptions): Promise<string>

    /**
     * Custom implementation for creating signed/temporary URLs for uploading files
     */
    generateSignedUploadURL?(
      key: string,
      filePath: string,
      options: SignedURLOptions
    ): Promise<string>
  }
}
