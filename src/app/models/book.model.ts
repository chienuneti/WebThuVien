/**
 * Book Models & Interfaces
 * For digital library system
 */

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
  userName: string; // Tên hiển thị lấy từ BE
  rating: number;
  content: string;
  createdAt: string;
}

export interface CommunityTreeDto {
  id: string;
  name: string;
  children: CommunityTreeDto[]; // Quan trọng: BE trả về List thì FE phải có mảng này
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
  // Các trường thống kê mới từ BE
  avgRating: number;
  totalReviews: number;
  totalDownloads: number;
  totalViews: number;
  // Khối thông tin đặc thù
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
  documentType: string; // Sửa documenttype -> documentType
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
  venueName: string;      // Sửa venuename -> venueName
  publicationType: string; // Sửa publicationtype -> publicationType
}

export interface Research {
  docid: string;
  abstract: string;
  researchLevel: string; // Sửa researchlevel -> researchLevel
}

export interface DocFile{
  id: string;
  docid: string;
  filepath: string;
  version: number;
  changenote: string;
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
  action: string;
  comments?: string;
  createdat: Date;
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

// Thêm vào file book.model.ts
export interface DocumentPopularDto extends DocumentListDto {
  downloadCount: number;
}

export interface DocumentList2Dto extends DocumentListDto {
  viewCount: number;
}