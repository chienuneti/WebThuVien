export interface Author {
  id: string;
  name: string;
  email?: string;
  description?: string;
  image?: string;
  expertise?: string;
  orcid?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Review {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface CommunityTreeDto {
  id: string;
  name: string;
  children: CommunityTreeDto[]; 
}

export interface Document {
  id: string;
  title: string;
  description: string;
  documenttype: string;
  publicationdate: Date;
  pagenum: number;
  createdAt: Date;
  introendpage: number;
  corverpath: string;
  isdeleted: boolean;
}

export interface DocumentListDto {
  id: string;
  title: string;
  documentType: string;
  publicationDate: Date;
  coverPath: string;
}

export interface ReadingDocument{
  userid: string;
  documentid: string;
  currentpage: number;
  lastreadat: Date;
  firstreadat: Date;
  iscounted: boolean;
}

export interface Discipline{
  id: string;
  name: string;
}

export interface Faculty{
  id: string;
  name: string;
}

export interface DocumentDetailDto {
  id: string;
  title: string;
  description: string;
  documentType: string;
  pageNum: number;
  publicationDate: Date;
  coverPath: string;
  authors: Author[];
  keywords: string[];
  identifiers: Identifier[];
  avgRating: number;
  totalReviews: number;
  totalDownloads: number;
  totalViews: number;
  internalBook?: InternalBook;
  thesis?: Thesis;
  research?: Research;
  externalBook?: ExternalBook;
  researchPublication?: ResearchPublication;
  licenses: License[];
}

export interface InternalBook {
  docid: string;
  faculty: string;
  documentType: string; 
  version: number;
}

export interface ExternalBook {
  docid: string;
  publisher: string;
  version: number;
}

export interface Thesis{
  docid: string;
  degreeLevel: string;
  discipline: string;
  advisorName: string;
  abstract: string;
}

export interface ResearchPublication {
  docid: string;
  venueName: string;     
  publicationType: string; 
}

export interface Research {
  docid: string;
  abstract: string;
  researchLevel: string; 
}

export interface DocFile{
  id: string;
  docId: string;
  filePath: string;
  version: number;
  changeNote: string;
}

export interface Collection{
  id: string;
  communityid: string;
  name: string;
  description: string;
  submissionpolicy: string;
  isactive: boolean;
  createdAt: Date;
}

export interface Community{
  id: string;
  name: string;
  description: string;
  prarentcommunityid: boolean;
  createdAt: Date;
}

export interface Download{
  id: string;
  documentid: string;
  userid: string;
  downloadat: Date;
}

export interface Identifier{
  id: string;
  documentid: string;
  type: string;
  value: string;
}

export interface Keyword{
  id: string;
  name: string;
}

export interface License{
  id: string;
  name: string;
  content: string;
}

export interface Permission{
  id: string;
  name: string;
}

export interface RefreshToken{
  id: string;
  userid: string;
  tokenhash: string;
  expiresat: Date;
  createdat: Date;
  revokedat?: Date;
}

export interface Submission{
  id: string;
  documentid: string;
  collectionid: string;
  submitter: string;
  status: string;
  currentstep: number;
  createdat: Date;
  updatedat: Date;
}

export interface SubmissionHistory{
  id: string;
  submissionid: string;
  performedby: string;
  performedname: string;
  action: string;
  comments?: string;
  createdat: Date;
}

export interface SubmissionListDto{
  submissionId: string;
  documentTitle: string;
  documentType: string;
  collectionName: string;
  createdAt: Date;
  status: string;
  currentStep: number;
  reviewerCount: number;
}

export interface User{
  id: string;
  name: string;
  email: string;
  phonenumber?: string;
  passwordhash: string;
  roleid: string;
  createdat: Date;
  updatedat: Date;
  class?: string;
}

export interface DocumentPopularDto extends DocumentListDto {
  downloadCount: number;
}

export interface DocumentList2Dto extends DocumentListDto {
  viewCount: number;
}

export interface CreateAuthorDto {
  name: string;
  email?: string;
  orcid?: string;
  description?: string;
  expertise?: string;
  imageFile?: File | null;
  imagePreview?: string | ArrayBuffer | null;
}

export interface CreateIdentifierDto {
  type: string;  
  value: string; 
}

export interface CreateLicenseDto {
  id?: string;       
  name?: string;     
  content?: string;  
  uiMode?: 'SELECT' | 'NEW'; 
  selectedId?: string; 
}

export interface CreateDocumentForm {
  title: string;
  description: string;
  documentType: 'InternalBook' | 'ExternalBook' | 'Thesis' | 'Research' | 'ResearchPublication';
  collectionId: string;
  publicationDate?: string;
  pageNum?: number;
  introEndPage?: number;
  file: File | null;
  coverFile: File | null;
  keywords: string; 
  authors: CreateAuthorDto[];
  identifiers: CreateIdentifierDto[]; 
  licenses: CreateLicenseDto[];       

  internalBook?: { faculty: string; documentType: string; version: string };
  externalBook?: { publisher: string; version: string };
  thesis?: { degreeLevel: string; discipline: string; advisorName: string; abstract: string };
  research?: { abstract: string; researchLevel: string };
  researchPublication?: { venueName: string; publicationType: string };
}