export class UrlService {
  static dashboard = () => "/";
  static deploymentList = () => `/deployments`;
  static deploymentDetails = (dseq) => `/deployment/${dseq}`;
  static settings = () => "/settings";

  static createDeployment = (dseq) => `/createDeployment${dseq ? "?redeploy=" + dseq : ""}`;
  static createDeploymentStepTemplate = () => "/createDeployment/chooseTemplate";
  static createDeploymentStepManifest = () => "/createDeployment/editManifest";
  static createDeploymentStepBids = () => "/createDeployment/acceptBids";
}
