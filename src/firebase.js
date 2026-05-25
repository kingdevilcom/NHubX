import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-7maf9y-bv8TilNyAhqaGMwPvuhTHPKc",
  authDomain: "nhubx-fc6d8.firebaseapp.com",
  projectId: "nhubx-fc6d8",
  storageBucket: "nhubx-fc6d8.firebasestorage.app",
  messagingSenderId: "869266066616",
  appId: "1:869266066616:web:6ffaa5ffa1b43e8187384d",
  measurementId: "G-140QDLY399"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// --- Messages Operations ---

// Save a contact form message
export const saveMessage = async (name, email, text) => {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      name,
      email,
      message: text,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving message to Firestore:", error);
    throw error;
  }
};

// Fetch all messages (newest first)
export const fetchMessages = async () => {
  try {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const msgs = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      let dateValue = new Date();
      if (data.timestamp) {
        if (typeof data.timestamp.toDate === 'function') {
          dateValue = data.timestamp.toDate();
        } else if (data.timestamp.seconds) {
          dateValue = new Date(data.timestamp.seconds * 1000);
        }
      }
      msgs.push({
        id: doc.id,
        ...data,
        timestamp: dateValue
      });
    });
    return msgs;
  } catch (error) {
    console.error("Error fetching messages from Firestore:", error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (id) => {
  try {
    await deleteDoc(doc(db, "messages", id));
  } catch (error) {
    console.error("Error deleting message from Firestore:", error);
    throw error;
  }
};

// --- Projects Operations ---

// Fetch all projects from Firestore
export const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projs = [];
    querySnapshot.forEach((doc) => {
      projs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return projs;
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    throw error;
  }
};

// Add or Update a project in Firestore
export const saveProject = async (project) => {
  try {
    const id = project.id ? String(project.id) : String(Date.now());
    const projectData = {
      name: project.name || '',
      description: project.description || '',
      fullDescription: project.fullDescription || '',
      status: project.status || 'DEV',
      type: project.type || 'personal',
      link: project.link || '',
      iconName: project.iconName || '',
      features: project.features || [],
      technologies: project.technologies || []
    };
    await setDoc(doc(db, "projects", id), projectData);
    return id;
  } catch (error) {
    console.error("Error saving project to Firestore:", error);
    throw error;
  }
};

// Delete a project from Firestore
export const deleteProject = async (id) => {
  try {
    await deleteDoc(doc(db, "projects", String(id)));
  } catch (error) {
    console.error("Error deleting project from Firestore:", error);
    throw error;
  }
};

// Initialize default projects if Firestore is empty
export const initializeDefaultProjects = async (defaultProjects) => {
  try {
    const existing = await fetchProjects();
    if (existing.length === 0) {
      console.log("Firestore projects list is empty. Initializing default projects...");
      for (const proj of defaultProjects) {
        // Strip non-serializable fields (like React elements for icons)
        const serializableProject = {
          id: proj.id ? String(proj.id) : String(Math.floor(Math.random() * 1000000)),
          name: proj.name,
          description: proj.description,
          fullDescription: proj.fullDescription || '',
          status: proj.status,
          type: proj.type,
          link: proj.link,
          iconName: proj.iconName || '',
          features: proj.features,
          technologies: proj.technologies
        };
        await saveProject(serializableProject);
      }
      return await fetchProjects();
    }
    return existing;
  } catch (error) {
    console.error("Error initializing default projects:", error);
    throw error;
  }
};
