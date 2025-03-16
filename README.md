<h1>Discogs Helper</h1><br/>

<ul>
  <li><b><a href="#tech-used">View the technology used here.</a></b></li>
</ul>

(the pictures in this markdown are from the NEXT/Tailwind version of the app I created)

<h5>
  Discogs Helper allows users to search for and manage their collection of vinyl records. By leveraging the Discogs API I was able to sync up a user's collection and wantlist
  according to their account with Discogs. Users can add, update, delete, and view records in their collection, which includes details such as title, artist,
  release year, genre, and style. The application will provide an interface for users to keep track of their vinyl collection and make necessary updates over time. 
  Additionally, users can manage a wish list of vinyl records, adding items they wish to acquire. This tool will help vinyl enthusiasts efficiently organize and maintain
  their collection, allowing them to track records of interest and manage their collection with ease.
</h5>
<br/>

<p><i>You are able to search any record you choose, since Discogs may be the biggest vinyl database in the world.</i></p>
<img width="1412" alt="Image" src="https://github.com/user-attachments/assets/58b5b552-4840-49e5-8484-13a99adf8a24" />

<p><i>Protects service with login system by utilizing Auth Context and a Protected Route component</i></p>
<img width="1404" alt="Image" src="https://github.com/user-attachments/assets/054b74c7-1809-4224-b505-f842631e3351" />

<p><i>Allows full control over wantlist and collection, and will also be synced with the Discogs site</i></p>
<img width="1440" alt="Image" src="https://github.com/user-attachments/assets/ac617fee-fb03-4533-9d14-292725b28b75" />

<p><i>Provides extensive detail about all releases, including pricing and tracklisting</i></p>
<img width="1412" alt="Image" src="https://github.com/user-attachments/assets/a1170aea-351d-4b08-b8f1-fdd07749ed04" />

<h1 id="tech-used">Key Technology in this Project</h1>

<h3>React Hook Form</h3>
Powered most forms included in the app. Allowed for effortless  login behavior management by providing register, and handleSubmit functions tied into the forms behavior.

<h3>Context API</h3>
Utilized the context hooks from react to verify if a user is allowed to visit routes. This includes cookie management using the react-cookie library to manage session.

<h3>Axios</h3>
Standard http request library, axios provides easy to use, readable request code to utilize backend services like my own or the Discogs API. Axios is helpful because it easily provides useful error messages and allows for extra complexity is necessary especially when leveraging third party services.
