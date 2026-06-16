interface GPUAdapter {}
interface GPU {}

interface NavigatorGpu {
  gpu?: {
    requestAdapter: () => Promise<GPUAdapter | null>;
  };
}
