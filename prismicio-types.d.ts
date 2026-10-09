import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type ContactDocumentDataSlicesSlice = never

/**
 * Item in *Contact → Contact info*
 */
export interface ContactDocumentDataContactInfoItem {
	/**
	 * Label field in *Contact → Contact info*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact.contact_info[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Content field in *Contact → Contact info*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact.contact_info[].content
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	content: prismic.KeyTextField;
	
	/**
	 * Link field in *Contact → Contact info*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact.contact_info[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Contact documents
 */
interface ContactDocumentData {
	/**
	 * Slice Zone field in *Contact*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ContactDocumentDataSlicesSlice>;
	
	/**
	 * Portrait field in *Contact*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact.portrait
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	portrait: prismic.ImageField<never>;
	
	/**
	 * Contact info field in *Contact*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact.contact_info[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	contact_info: prismic.GroupField<Simplify<ContactDocumentDataContactInfoItem>>;
	
	/**
	 * Dominant color field in *Contact*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact.dominant_color
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	dominant_color: prismic.ColorField;/**
	 * Meta Title field in *Contact*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: contact.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Contact*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: contact.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Contact*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Contact document from Prismic
 *
 * - **API ID**: `contact`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ContactDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ContactDocumentData>, "contact", Lang>;

type HomepageDocumentDataSlicesSlice = never

/**
 * Item in *Homepage → Gallery*
 */
export interface HomepageDocumentDataGalleryItem {
	/**
	 * Photo field in *Homepage → Gallery*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.gallery[].photo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	photo: prismic.ImageField<never>;
	
	/**
	 * Title field in *Homepage → Gallery*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.gallery[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Place field in *Homepage → Gallery*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.gallery[].place
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	place: prismic.KeyTextField;
	
	/**
	 * Date field in *Homepage → Gallery*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.gallery[].date
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	date: prismic.KeyTextField;
	
	/**
	 * Blurb (optional caption text) field in *Homepage → Gallery*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.gallery[].blurb
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	blurb: prismic.RichTextField;
	
	/**
	 * Dominant color field in *Homepage → Gallery*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.gallery[].dominant_color
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	dominant_color: prismic.ColorField;
}

/**
 * Content for Homepage documents
 */
interface HomepageDocumentData {
	/**
	 * Slice Zone field in *Homepage*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomepageDocumentDataSlicesSlice>;
	
	/**
	 * Hero image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.hero_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	hero_image: prismic.ImageField<never>;
	
	/**
	 * Hero tagline field in *Homepage*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.hero_tagline
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	hero_tagline: prismic.RichTextField;
	
	/**
	 * About title field in *Homepage*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.about_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	about_title: prismic.RichTextField;
	
	/**
	 * About text (left) field in *Homepage*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.about_text_left
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	about_text_left: prismic.RichTextField;
	
	/**
	 * About text (right) field in *Homepage*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.about_text_right
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	about_text_right: prismic.RichTextField;
	
	/**
	 * Gallery field in *Homepage*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.gallery[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	gallery: prismic.GroupField<Simplify<HomepageDocumentDataGalleryItem>>;
	
	/**
	 * Outro image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.outro_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	outro_image: prismic.ImageField<never>;/**
	 * Meta Title field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: homepage.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: homepage.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomepageDocumentData>, "homepage", Lang>;

type WorkDocumentDataSlicesSlice = never

/**
 * Item in *Gallery → Summer*
 */
export interface WorkDocumentDataSummerItem {
	/**
	 * Photo field in *Gallery → Summer*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.summer[].photo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	photo: prismic.ImageField<never>;
	
	/**
	 * Title field in *Gallery → Summer*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.summer[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Place field in *Gallery → Summer*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.summer[].place
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	place: prismic.KeyTextField;
	
	/**
	 * Date field in *Gallery → Summer*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.summer[].date
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	date: prismic.KeyTextField;
	
	/**
	 * Dominant color field in *Gallery → Summer*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.summer[].dominant_color
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	dominant_color: prismic.ColorField;
}

/**
 * Item in *Gallery → Autumn*
 */
export interface WorkDocumentDataAutumnItem {
	/**
	 * Photo field in *Gallery → Autumn*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.autumn[].photo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	photo: prismic.ImageField<never>;
	
	/**
	 * Title field in *Gallery → Autumn*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.autumn[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Place field in *Gallery → Autumn*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.autumn[].place
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	place: prismic.KeyTextField;
	
	/**
	 * Date field in *Gallery → Autumn*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.autumn[].date
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	date: prismic.KeyTextField;
	
	/**
	 * Dominant color field in *Gallery → Autumn*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.autumn[].dominant_color
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	dominant_color: prismic.ColorField;
}

/**
 * Item in *Gallery → Winter*
 */
export interface WorkDocumentDataWinterItem {
	/**
	 * Photo field in *Gallery → Winter*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.winter[].photo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	photo: prismic.ImageField<never>;
	
	/**
	 * Title field in *Gallery → Winter*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.winter[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Place field in *Gallery → Winter*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.winter[].place
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	place: prismic.KeyTextField;
	
	/**
	 * Date field in *Gallery → Winter*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.winter[].date
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	date: prismic.KeyTextField;
	
	/**
	 * Dominant color field in *Gallery → Winter*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.winter[].dominant_color
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	dominant_color: prismic.ColorField;
}

/**
 * Item in *Gallery → Spring*
 */
export interface WorkDocumentDataSpringItem {
	/**
	 * Photo field in *Gallery → Spring*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.spring[].photo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	photo: prismic.ImageField<never>;
	
	/**
	 * Title field in *Gallery → Spring*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.spring[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Place field in *Gallery → Spring*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.spring[].place
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	place: prismic.KeyTextField;
	
	/**
	 * Date field in *Gallery → Spring*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.spring[].date
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	date: prismic.KeyTextField;
	
	/**
	 * Dominant color field in *Gallery → Spring*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.spring[].dominant_color
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	dominant_color: prismic.ColorField;
}

/**
 * Content for Gallery documents
 */
interface WorkDocumentData {
	/**
	 * Slice Zone field in *Gallery*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<WorkDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Gallery*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: work.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Gallery*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: work.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Gallery*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;/**
	 * Summer field in *Gallery*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.summer[]
	 * - **Tab**: Summer
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	summer: prismic.GroupField<Simplify<WorkDocumentDataSummerItem>>;/**
	 * Autumn field in *Gallery*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.autumn[]
	 * - **Tab**: Autumn
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	autumn: prismic.GroupField<Simplify<WorkDocumentDataAutumnItem>>;/**
	 * Winter field in *Gallery*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.winter[]
	 * - **Tab**: Winter
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	winter: prismic.GroupField<Simplify<WorkDocumentDataWinterItem>>;/**
	 * Spring field in *Gallery*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: work.spring[]
	 * - **Tab**: Spring
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	spring: prismic.GroupField<Simplify<WorkDocumentDataSpringItem>>;
}

/**
 * Gallery document from Prismic
 *
 * - **API ID**: `work`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type WorkDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<WorkDocumentData>, "work", Lang>;

export type AllDocumentTypes = ContactDocument | HomepageDocument | WorkDocument;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			ContactDocument,
			ContactDocumentData,
			ContactDocumentDataSlicesSlice,
			ContactDocumentDataContactInfoItem,
			HomepageDocument,
			HomepageDocumentData,
			HomepageDocumentDataSlicesSlice,
			HomepageDocumentDataGalleryItem,
			WorkDocument,
			WorkDocumentData,
			WorkDocumentDataSlicesSlice,
			WorkDocumentDataSummerItem,
			WorkDocumentDataAutumnItem,
			WorkDocumentDataWinterItem,
			WorkDocumentDataSpringItem,
			AllDocumentTypes
		}
	}
}