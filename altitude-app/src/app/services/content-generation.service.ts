import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ContentGenerationService {
  private apiUrl = 'http://18.116.64.253:3000/generate-content';
  private campaignUrl = 'http://18.116.64.253:3301/campaign/2676';
  private publishMarketoUrl = 'http://18.116.64.253:5000/update-email';
  private imageGenerationUrl = 'http://18.116.64.253:4000/generate-image';

  //plagrismApiUrl = 'https://cors-anywhere.herokuapp.com/https://www.copyscape.com/api/?u=spat20&k=hv9s5a23a90592ds&o=csearch&e=UTF-8';

  private brandApiUrl = 'https://api.brandfetch.io/v2/brands/';
  private headers = new HttpHeaders({
    Authorization: 'Bearer as2T2/s+O/pgZBJd21OXyXO7c+gGYRxd00Yo8pqTh0c=',
  });

  //social media
  private facebookToken =
    'EAAM2rack6zEBO1OpevE0wGGXmAZBZAxP8dPyAEHBvCtlxoaPvAtLl0SLvQfQUy2GDFgNOg9ctcdLcjx0M64zaVGb4oDhYi3hPv0QoEq0zA6iTXX6D0dBQLYyP4XZAPmq2ZAXKZApRAdjKFNWwYBZBAiVCkxZBNoNqJB7AZCsm8lcRBZCZAIhNXzPo41vXjjz3qEojZCKuw1QzJS';

  private instaToken = '';

  // New URL
  private dataSubject = new BehaviorSubject<any>(null);
  private blockDataSubject = new BehaviorSubject<any>(null);
  private emailDataSubject = new BehaviorSubject<any>(null);
  private socialDataSubject = new BehaviorSubject<any>(null);
  private socialDataSubject1 = new BehaviorSubject<any>(null);
  private subDataSubject = new BehaviorSubject<any>(null);
  private audianceDataSubject = new BehaviorSubject<any>(null);
  private audianceDataSubject1 = new BehaviorSubject<any>(null);
  private audianceDataSubject2 = new BehaviorSubject<any>(null);

  private emailSub = new BehaviorSubject<any>(null);
  public formData$: Observable<any> = this.dataSubject.asObservable();
  public emailData$: Observable<any> = this.emailDataSubject.asObservable();
  public emailsubjectData$: Observable<any> = this.emailSub.asObservable();
  public socialData$: Observable<any> = this.socialDataSubject.asObservable();
  public socialData1$: Observable<any> = this.socialDataSubject1.asObservable();
  public subData$: Observable<any> = this.subDataSubject.asObservable();
  public audianceData$: Observable<any> =
    this.audianceDataSubject.asObservable();
  public audianceData1$: Observable<any> =
    this.audianceDataSubject1.asObservable();
  public audianceData2$: Observable<any> =
    this.audianceDataSubject2.asObservable();
  public blogData$: Observable<any> = this.blockDataSubject.asObservable();

  //product
  private productDesc = new BehaviorSubject<any>(null);
  public desc$: Observable<any> = this.productDesc.asObservable();

  private imageSubject = new BehaviorSubject<any>(null);
  public imageData$: Observable<any> = this.imageSubject.asObservable();

  //offer image
  private imageOfferSubject = new BehaviorSubject<any>(null);
  public imageOfferData$: Observable<any> =
    this.imageOfferSubject.asObservable();

  //offer image
  private imageEventSubject = new BehaviorSubject<any>(null);
  public imageEventData$: Observable<any> =
    this.imageEventSubject.asObservable();

  //heading
  private emailHeadDataSubject = new BehaviorSubject<any>(null);
  public emailHeadData$: Observable<any> =
    this.emailHeadDataSubject.asObservable();

  private plagrism = new BehaviorSubject<any>(null);
  public plagrismData$: Observable<any> = this.plagrism.asObservable();

  private publisurl = new BehaviorSubject<any>(null);
  public publishData$: Observable<any> = this.publisurl.asObservable();

  //new email and video
  private socialResponseData11 = new BehaviorSubject<any>(null); // Initialize with null or an initial value
  socialResponseData11$ = this.socialResponseData11.asObservable(); // Expose as an Observable

  private socialResponseData22 = new BehaviorSubject<any>(null); // Initialize with null or an initial value
  socialResponseData22$ = this.socialResponseData22.asObservable(); // Expose as an Observable
  // storyboard generation
  private isBack = new BehaviorSubject<any>(false);
  isBack$ = this.isBack.asObservable();
  // private generateStyle = new BehaviorSubject<any>(null);
  // generateStyle$ = this.generateStyle.asObservable();

  // style selected
  private styleSelected = new BehaviorSubject<any>(null); // Initialize with null or an initial value
  styleSelected$ = this.styleSelected.asObservable();
  private templateId = signal('');
  private memeFormData = signal(null);
  private hashTags = signal(null);
  constructor(private http: HttpClient) {}

  getTemplateId(): string {
    return this.templateId();
  }
  getHashTags(): any {
    return this.hashTags();
  }
  setHashTags(value: any): void {
    this.hashTags.set(value);
  }
  getMemeFormData(): any {
    return this.memeFormData();
  }
  setMemeFormData(data: any): void {
    this.memeFormData.set(data);
  }
  setTemplateId(value: string): void {
    this.templateId.set(value);
  }
  // Method to set data
  setData(data: any): void {
    this.dataSubject.next(data);
  }

  // Method to get data
  getData(): Observable<any> {
    return this.formData$;
  }

  // Method to set data
  setImage(data: any): void {
    this.imageSubject.next(data);
  }

  // Method to get data
  getImage(): Observable<any> {
    return this.imageData$;
  }
  //offer image
  // Method to set data
  setOfferImage(data: any): void {
    this.imageOfferSubject.next(data);
  }

  // Method to get data
  getOfferImage(): Observable<any> {
    return this.imageOfferData$;
  }
  //event image
  // Method to set data
  setEventImage(data: any): void {
    this.imageEventSubject.next(data);
  }

  // Method to get data
  getEventImage(): Observable<any> {
    return this.imageEventData$;
  }

  // Method to set blog response data
  setBlogResponseData(data: any): void {
    this.blockDataSubject.next(data);
  }

  // Method to get blog response data
  getBlogResponsetData(): Observable<any> {
    return this.blogData$;
  }

  // Method to set social response data
  setSocialResponseData(data: any): void {
    this.socialDataSubject.next(data);
  }

  // Method to get social response data
  getSocialResponsetData(): Observable<any> {
    return this.socialData$;
  }

  // Method to set social response data
  setSocialResponseData1(data: any): void {
    this.socialDataSubject1.next(data);
  }

  // Method to get social response data
  getSocialResponsetData1(): Observable<any> {
    return this.socialData1$;
  }
  // Method to set email subject response data
  setSubjectResponseData(data: any): void {
    this.subDataSubject.next(data);
  }

  // Method to get email subject response data
  getSubjectResponseData(): Observable<any> {
    return this.subData$;
  }

  // Method to set email subject response data
  setAudianceResponseData(data: any): void {
    this.audianceDataSubject.next(data);
  }

  // Method to get email subject response data
  getAudianceResponseData(): Observable<any> {
    return this.audianceData$;
  }

  // Method to set email subject response data
  setAudianceResponseData1(data: any): void {
    this.audianceDataSubject1.next(data);
  }

  // Method to get email subject response data
  getAudianceResponseData1(): Observable<any> {
    return this.audianceData1$;
  }

  // Method to set email subject response data
  setAudianceResponseData2(data: any): void {
    this.audianceDataSubject2.next(data);
  }

  // Method to get email subject response data
  getAudianceResponseData2(): Observable<any> {
    return this.audianceData2$;
  }

  // Method to set email subject response data
  setEmailSubResponseData(data: any): void {
    this.emailSub.next(data);
  }

  // Method to get email subject response data
  getEmailSubResponsetData(): Observable<any> {
    return this.emailsubjectData$;
  }
  setIsBack(data: any): void {
    this.isBack.next(data);
  }
  getIsBack(): Observable<any> {
    return this.isBack$;
  }

  // Method to set email response data
  setEmailResponseData(data: any): void {
    this.emailDataSubject.next(data);
  }

  // Method to get email response data
  getEmailResponsetData(): Observable<any> {
    return this.emailData$;
  }

  // Method to set email response data
  setEmailHeadResponseData(data: any): void {
    this.emailHeadDataSubject.next(data);
  }

  // Method to get email response data
  getEmailHeadResponsetData(): Observable<any> {
    return this.emailHeadData$;
  }

  setplagrism(data: any): void {
    this.plagrism.next(data);
  }

  // Method to get email response data
  getplagrism(): Observable<any> {
    return this.plagrismData$;
  }

  setpublish(data: any): void {
    this.publisurl.next(data);
  }

  // Method to get email response data
  getpublish(): Observable<any> {
    return this.publishData$;
  }

  //new email and video
  setSocialResponseData11(data: any) {
    this.socialResponseData11.next(data); // Emit the new data through the BehaviorSubject
  }

  getSocialResponsetData11(): Observable<any> {
    return this.socialResponseData11$;
  }

  setSocialResponseData22(data: any) {
    this.socialResponseData22.next(data); // Emit the new data through the BehaviorSubject
  }

  getSocialResponsetData22(): Observable<any> {
    return this.socialResponseData22$;
  }
  // method to generate storyboards
  // setStyle(data: any) {
  //   this.generateStyle.next(data);
  // }
  // getStyleData(): Observable<any> {
  //   return this.generateStyle$;
  // }
  // method to set style
  setSelectedStyle(data: any) {
    this.styleSelected.next(data);
  }
  getSelectedStyle() {
    return this.styleSelected$;
  }
  private productResponses = new BehaviorSubject<any[]>([]); // Holds the array of responses

  // Setter to update the array of responses
  setProductResponseData(response: any): void {
    const currentResponses = this.productResponses.getValue(); // Get the current array
    this.productResponses.next([...currentResponses, response]); // Append the new response
  }

  // Getter to retrieve the array of responses
  getProductResponsetData(): Observable<any[]> {
    return this.productResponses.asObservable();
  }

  // Method to generate content
  generateContent(prompt: string, type: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { prompt, type };

    return this.http
      .post(this.apiUrl, body, { headers })
      .pipe(catchError(this.handleError('generateContent', {})));
  }

  // Method to fetch campaign data
  fetchCampaignData(): Observable<any> {
    return this.http
      .get<any>(this.campaignUrl)
      .pipe(catchError(this.handleError('fetchCampaignData', {})));
  }

  // Handle HTTP errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Optionally, log the error to an external service
      return of(result as T);
    };
  }

  //publish marketo api
  publishContent(
    emailContent: any,
    emailId: string,
    htmlId: string
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { emailContent, emailId, htmlId };

    return this.http
      .post(this.publishMarketoUrl, body, { headers })
      .pipe(catchError(this.handleError('publishContent', {})));
  }
  //publish marketo api
  imageGeneration(prompt: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { prompt };

    return this.http
      .post(this.imageGenerationUrl, body, { headers })
      .pipe(catchError(this.handleError('imageGenerationUrl', {})));
  }

  //image generate for event and offer
  eventImageGeneration(prompt: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { prompt };

    return this.http
      .post(this.imageGenerationUrl, body, { headers })
      .pipe(catchError(this.handleError('imageGenerationUrl', {})));
  }

  offerImageGeneration(prompt: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { prompt };

    return this.http
      .post(this.imageGenerationUrl, body, { headers })
      .pipe(catchError(this.handleError('imageGenerationUrl', {})));
  }

  //post to insta
  async postInstagram(imageUrl: string, caption: string) {
    const url = ``;
    const data = {
      image_url: imageUrl,
      caption: caption,
      access_token: this.instaToken,
    };
    try {
      const response = await axios.post(url, data);
      console.log('Instagram Post Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Instagram Post Error:', error);
    }
  }

  //post to facebook
  /*async postFacebook(imageUrl: string, message: string, _link: any){
      const image_url =`https://graph.facebook.com/v21.0/448277481703210/photos`;
      const data = {
        url: imageUrl,
        published: false,
        access_token: this.facebookToken
      };

      try{
        const response = await axios.post(image_url, data);
        console.log('Facebook Photo Response:',  response.data);
        const imageId = response.data.id;
        console.log('image id :',  response.data.id);


        const post_url =`https://graph.facebook.com/v21.0/448277481703210/feed`;
        const content = {
          message: message,
          attached_media: [{ media_fbid: imageId}],
          access_token: this.facebookToken,
        }
        try{
          const responses = await axios.post(post_url, content);
          console.log('Facebook Post feed Response:',  responses.data);

        }catch(error){
          console.error('Facebook Post feed Error:', error);
        }
        return response.data;
      }catch(error){
        console.error('Facebook Post Error:', error);
      }
     }*/
  async postFacebook(imageUrl: string, message: string, _link: any) {
    const pageId = '448277481703210'; // Your Facebook Page ID
    const pageAccessToken = this.facebookToken; // Page Access Token

    // Step 1: Upload the photo to the page
    const photoUploadUrl = `https://graph.facebook.com/v17.0/${pageId}/photos`;
    const photoData = {
      url: imageUrl,
      published: false, // Unpublished photo to attach to the post
      access_token: pageAccessToken,
    };

    try {
      const photoResponse = await axios.post(photoUploadUrl, photoData);
      console.log('Facebook Photo Response:', photoResponse.data);

      const photoId = photoResponse.data.id;
      console.log('Uploaded Photo ID:', photoId);

      // Step 2: Create a post with the uploaded photo
      const postUrl = `https://graph.facebook.com/v17.0/${pageId}/feed`;
      const postData = {
        message: message,
        attached_media: [{ media_fbid: photoId }], // Attach the photo by its ID
        access_token: pageAccessToken,
      };

      try {
        const postResponse = await axios.post(postUrl, postData);
        console.log('Facebook Post Response:', postResponse.data);
        return postResponse.data;
      } catch (postError) {
        console.error('Error posting to Facebook feed:', postError);
      }
    } catch (photoError) {
      console.error('Error uploading photo to Facebook:', photoError);
    }
  }

  /*getLatestPosts(): Observable<any[]> {
      const url = `${this.facebookUrl}${this.bmwPageId}/posts?fields=id,message,attachments{type,media.image.src,media.video.src}&limit=5&access_token=${this.facebookToken}`;
      return this.http.get<any[]>(url);
    }*/

  filterPosts(posts: any[]): any[] {
    return posts.filter((post) => {
      const attachments = post.attachments || [];
      const imageCount = attachments.filter(
        (attachment: { type: string }) => attachment.type === 'photo'
      ).length;
      const videoCount = attachments.filter(
        (attachment: { type: string }) => attachment.type === 'video'
      ).length;
      return imageCount <= 4 && videoCount <= 1;
    });
  }

  getBrandData(brandName: string): Observable<any> {
    let brand = brandName?.trim();
    let brandlogo = '';
    if (brand) {
      const brandName = brand.replace(/\s+/g, '');
      brandlogo = brandName + '';
      console.log('api beand logo:', brandlogo);
    }
    return this.http.get<any>(`${this.brandApiUrl}${brandlogo}`, {
      headers: this.headers,
    });
  }

  private emailBaseUrl = 'https://api.pexels.com/v1';
  private emailApiKey =
    '7QkFL7n5SL2LGFElHImrkQvK9qAR3JPkdA6LRPtlVAllz7ZRDnhuO4Vy';
  // Fetch the latest 4 images for a given brand
  getImages(brand: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: this.emailApiKey });
    return this.http.get(
      `${this.emailBaseUrl}/search?query=${brand}&per_page=4`,
      { headers }
    );
  }

  // Fetch 1 video for a given brand
  getVideo(brand: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: this.emailApiKey });
    return this.http.get(
      `${this.emailBaseUrl}/videos/search?query=${brand}&per_page=1`,
      { headers }
    );
  }

  private mediaUrl = 'http://18.116.64.253:4040/upload-image';

  private blogBaseUrl = 'https://contentadda.in/wp-json/wp/v2/posts'; // WordPress posts endpoint
  private username = 'mandeep'; // Your WordPress username
  private applicationPassword = '4NN7 qKKM zpWw 26XA 7axx vcCd';

  /*
  private downloadAndUploadImage(imageUrl: string): Observable<any> {
    return new Observable((observer) => {

     // const corsProxy = 'https://api.allorigins.win/get?url=';
   // const proxiedImageUrl = corsProxy + imageUrl;
      console.log(" blog upload 1");
      this.http.get(encodeURIComponent(imageUrl), { responseType: 'blob' }).subscribe(
        (imageBlob) => {

          console.log("Blob type:", imageBlob.type);
          const formData = new FormData();

          // Use a default type if the blob type is not recognized
          const mimeType = imageBlob.type || 'image/jpeg'; // Default type
          const fileName = 'downloaded-image'; // Base name, adjust as needed

          // Adjust the extension based on the blob type
          const extension = mimeType === 'image/png' ? '.png' : '.jpg';
          const imageFile = new File([imageBlob], fileName + extension, { type: mimeType });

          formData.append('file', imageFile);


          const headers = new HttpHeaders({
            'Authorization': 'Basic ' + btoa(`${this.username}:${this.applicationPassword}`)
          });
          console.log(" blog upload 3");
          this.http.post<any>(this.mediaUrl, formData, { headers }).subscribe(
            (uploadResponse) => {
              console.log(" blog upload 4");
              observer.next(uploadResponse);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }


  createPost1(title: string, content: string, imageUrl: string): Observable<any> {
    return new Observable((observer) => {
      this.downloadAndUploadImage(imageUrl).subscribe(
        (imageResponse) => {
          console.log(" blog post 1");
          const imageId = imageResponse.id; // Assuming imageResponse contains the ID
          const postData = {
            title,
            content,
            status: 'publish',
            featured_media: imageId // Set the uploaded image as the featured image
          };
          console.log(" blog post 2 ");
          const headers = new HttpHeaders({
            'Authorization': 'Basic ' + btoa(`${this.username}:${this.applicationPassword}`),
            'Content-Type': 'application/json'
          });

          this.http.post(this.blogBaseUrl, postData, { headers }).subscribe(
            (postResponse) => {
              observer.next(postResponse);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
  */

  imageId(imageUrl: string): Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { imageUrl };

    return this.http.post(this.mediaUrl, body, { headers }).pipe(
      map((response: any) => {
        // Extract the media ID from the response
        console.log(' response :', response);
        return response.mediaId; // Adjust this line if your response structure is different
      }),
      catchError(this.handleError('imageGenerationUrl', 0)) // Handle errors and return a default value
    );
  }
  createPost1(
    title: string,
    content: string,
    imageUrl: string
  ): Observable<any> {
    return this.imageId(imageUrl).pipe(
      switchMap((mediaId) => {
        console.log(' id :', mediaId);
        const postData = {
          title: title,
          content: content,
          status: 'publish',
          featured_media: mediaId, // Use the media ID here
        };

        const headers = new HttpHeaders({
          Authorization:
            'Basic ' + btoa(`${this.username}:${this.applicationPassword}`),
          'Content-Type': 'application/json',
        });

        console.log('Sending post...');
        return this.http.post(this.blogBaseUrl, postData, { headers });
      }),
      catchError(this.handleError('createPost1', {})) // Handle any errors
    );
  }

  /*
 createPost1(title: string, content: string, imageUrl: string): Observable<any> {

   const postData = {
      title: title,
      content: `<img src="${imageUrl}" alt="Image"/>${content}`,
      status: 'publish'
    };
    console.log("sending post ");
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.username}:${this.applicationPassword}`),
      'Content-Type': 'application/json'
    });
     console.log("enter into blog post---");
    return this.http.post(this.blogBaseUrl, postData, { headers });
  }
*/
  createPost2(title: string, content: string): Observable<any> {
    const postData = {
      title: title,
      content: content,
      status: 'publish',
    };

    const headers = new HttpHeaders({
      Authorization:
        'Basic ' + btoa(`${this.username}:${this.applicationPassword}`),
      'Content-Type': 'application/json',
    });
    console.log('enter into blog post---');
    return this.http.post(this.blogBaseUrl, postData, { headers });
  }

  private plagrismApiUrl = 'http://18.116.64.253:3100/copyscape-check';
  // Function to send the plagiarism check request
  checkPlagiarism(copyscapeText: string): Observable<string> {
    // Set up the request body
    const requestBody = {
      copyscape_text: copyscapeText,
    };

    // Set up headers if necessary (optional)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.plagrismApiUrl, requestBody, {
      headers,
      responseType: 'text',
    });
    // Send the POST request to the server
    /*return this.http.post<any>(this.plagrismApiUrl, requestBody, { headers }).pipe(
        map(response => this.extractTitleUsingRegex(response))
      );*/
  }

  /* private extractTitleUsingRegex(response: string): string {
    console.log("Plagrism response :",response );
    // Regular expression to match the content inside <title>...</title>
    const regex = /<title>(.*?)<\/title>/i;
    const match = response.match(regex);

    // If a match is found, return the content inside the <title> tag, otherwise return a default message
    if (match && match[1]) {
      return match[1].trim();
    } else {
      return 'No title found'; // Default if no title tag is found
    }
  }*/
  //performance
  private pageSpeedUrl =
    'http://18.116.64.253:3030/pagespeed?url=https://contentadda.in';
  getPerformanceData(): Observable<any> {
    const url = `${this.pageSpeedUrl}`;
    return this.http.get<any>(url);
  }
  //csv

  private productDescUrl = 'http://18.116.64.253:7000/generate-description';

  // Method to call the API
  generateDescription(data: {
    imageUrl: string;
    attributes: string;
  }): Observable<any> {
    console.log('Parsed CSV url:', data.imageUrl);
    console.log('Parsed CSV att:', data.attributes);
    return this.http.post(this.productDescUrl, data);
  }

  //banner post
  private apiBannerUrl = 'http://18.116.64.253:3444/process'; // API endpoint

  submitForm(
    url1: any,
    url2: any,
    prompt1: any,
    position: any
  ): Observable<any> {
    const body = {
      modelUrl: url1,
      necklaceUrl: url2,
      prompt: prompt1,
      necklaceWidthMultiplier: 1.5,
      necklaceYOffset: 0.0,
      necklaceLeftOffset: 5,
      modelPosition: position,
    };

    return this.http.post(this.apiBannerUrl, body);
  }

  saveForm(
    url1: any,
    url2: any,
    prompt1: any,
    value1: any,
    value2: any,
    value3: any,
    position: any
  ): Observable<any> {
    const body = {
      modelUrl: url1,
      necklaceUrl: url2,
      prompt: prompt1,
      necklaceWidthMultiplier: value1,
      necklaceYOffset: value2,
      necklaceLeftOffset: value3,
      modelPosition: position,
    };

    return this.http.post(this.apiBannerUrl, body);
  }

  //publis email
  private apiEmailUrl = 'http://18.116.64.253:3434/send-email'; // Replace with your email API URL

  sendEmail(to: string, subject: string, htmlContent: string): Observable<any> {
    const emailData = {
      to: to,
      subject: subject,
      htmlContent: htmlContent,
    };
    return this.http.post<any>(this.apiUrl, emailData);
  }

  //generate gif
  private apiGifUrl = 'http://18.116.64.253:3555/create-animation';

  createAnimation(
    urlData: string[],
    format: string,
    fps: string,
    position: string
  ): Observable<any> {
    const data = {
      urls: urlData,
      format: format,
      fps: fps,
      resolution: position,
    };
    return this.http.post<any>(this.apiGifUrl, data);
  }

  private apis3Url = 'http://18.116.64.253:3535/upload-to-s3';
  storeImage(url: string): Observable<any> {
    const data = {
      imageUrl: url,
    };
    return this.http.post<any>(this.apis3Url, data);
  }

  //html template email
  private htmlHeaders = new HttpHeaders({
    'Content-Type': 'text/html', // Ensure content type is set to HTML
  });

  sendHtmlEmail(url: string, htmlContent: string): Observable<any> {
    // Perform the POST request
    return this.http.post(url, htmlContent, { headers: this.htmlHeaders });
  }

  //background animation
  private apibackUrl = 'http://18.116.64.253:3636/make-video';

  createBackgroundAnimation(prompt: string, url1: string): Observable<any> {
    const data = {
      prompt: prompt,
      imageUrl: url1,
    };
    return this.http.post<any>(this.apibackUrl, data);
  }

  private apiUrlABTest = 'http://18.224.31.151:5001/generate_ab_test';
  generateABTest(brief: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { brief: brief };

    // return this.http.post<any>(this.apiUrlABTest, body, { headers });
    return this.http
      .post(this.apiUrlABTest, body, { headers })
      .pipe(catchError(this.handleError('EmailContent', {})));
  }

  private apiUrlScript = 'http://18.224.31.151:5000/generate_script';
  generateScript(brief: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { brief: brief };

    //return this.http.post<any>(this.apiUrlScript, body, { headers });
    return this.http
      .post(this.apiUrlScript, body, { headers })
      .pipe(catchError(this.handleError('VideoContent', {})));
  }

  //  api for storyboard
  private apiUrlStory = 'http://18.224.31.151:5006/generate_storyboard';
  generateStoryBoard(scriptId: string, style: number | null) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { script_id: scriptId, style: style };
    return this.http.post(this.apiUrlStory, body, { headers });
  }
  // api for video script
  private apiUrlVideoScript = 'http://18.224.31.151:5010/analyze-scenes';
  generateVideoScript(scriptId: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { script_id: scriptId };
    return this.http.post(this.apiUrlVideoScript, body, { headers });
  }
  // video generation api
  private apiGenerateVideo = 'http://18.224.31.151:5009/generate-script-videos';
  generateVideo(videoId: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { script_id: videoId };
    return this.http.post(this.apiGenerateVideo, body, { headers });
  }
  // vo generation api
  private apiVoiceGeneration = 'http://18.224.31.151:5013/generate-vo';
  generateVoice(videoId: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { videoscript_id: videoId };
    return this.http.post(this.apiVoiceGeneration, body, { headers });
  }
  private memeApiUrl = 'http://localhost:3000/api';
  getMemeTemplates(): Observable<any> {
    return this.http.get<any>(`${this.memeApiUrl}/meme-templates`);
  }
  getTrendingHashtags(): Observable<any> {
    return this.http.get<any>(`${this.memeApiUrl}/trending-hashtags`);
  }
  generateMeme(
    tone: string,
    templateId: string,
    hashtags: string
  ): Observable<any> {
    const requestBody = {
      tone: tone,
      templateId: templateId,
      hashtags: hashtags,
    };
    return this.http.post<any>(`${this.memeApiUrl}/generate-meme`, requestBody);
  }
}
