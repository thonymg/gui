
export interface Link {
  href: string;
}

export interface Links {
  hooks: Link;
  self: Link;
  repositories: Link;
  html: Link;
  followers: Link;
  avatar: Link;
  following: Link;
  snippets: Link;
}

export interface IBitbucketUser {
  username: string;
  website: string;
  display_name: string;
  account_id: string;
  links: Links;
  created_on: Date;
  is_staff: boolean;
  location?: any;
  type: string;
  uuid: string;
}
