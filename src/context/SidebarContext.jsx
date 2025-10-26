'use client';
import { usePathname } from "next/navigation";

import { createContext, useContext, useEffect, useState } from "react";
import localforage from "localforage";
import CryptoJS from "crypto-js";
import axiosInstance, {setUserInterceptor} from '@/utils/axios';

// FontAwesome icons
import {
  FaTools,
  FaBuilding,
  FaDraftingCompass,
  FaShieldAlt,
  FaAppleAlt,
  FaCarrot,
  FaCheese,
  FaDrumstickBite,
  FaBreadSlice,
  FaFish,
  FaGlasses,
  FaDeaf,
  FaHandPaper,
  FaShoePrints,
  FaVest,
} from "react-icons/fa";
// Game icons
import { GiShrimp, GiFishEggs ,GiGasMask, GiBeltArmor, GiFallDown } from "react-icons/gi";
// Material Design icons
import {  
  MdDashboard,
  MdInventory2,
  MdWorkspacePremium,
  MdHealthAndSafety,
  MdMasks,
  MdWork,
  MdShoppingCart,
  MdCategory
} from "react-icons/md";
import { RiShieldStarFill } from "react-icons/ri";
import toast from "react-hot-toast";
const SidebarContext = createContext();

const Sidebarlist={
  '/':[
      { id: 1, title: "Manage Admin", icon: <MdDashboard />,path:'/manage-admin' },
      { id: 2, title: "Pending Admin", icon: <MdShoppingCart />,path:'/pending-admin' },
      { id: 3, title: "Assign Admin", icon: <MdInventory2 />,path:'/assign-admin' },
      { id: 4, title: "Profile", icon: <MdWorkspacePremium />,path:'/profile' },  
  ],
  '/helmet&safty-accessories':[
      { id: 1, title: "Dashboard", icon: <MdDashboard />,path:'/helmet&safty-accessories' },
      { id: 2, title: "Add Product", icon: <MdShoppingCart />,path:'/helmet&safty-accessories/add-product' },
      { id: 3, title: "All Products", icon: <MdInventory2 />,path:'/helmet&safty-accessories/all-products' },
      { id: 4, title: "Featured Products", icon: <MdWorkspacePremium />,path:'/helmet&safty-accessories/featured-products' },  
      {
        id: 5,
        title: "Motorcycle Helmets",
        icon: <FaShieldAlt />, // valid helmet substitute
        categories: [
          { id: 1, title: "Full Face", icon: <RiShieldStarFill />,path:'/helmet&safty-accessories/category/full-face' },
          { id: 2, title: "Modular Face", icon: <MdWork />,path:'/helmet&safty-accessories/category/modular-face' },
          { id: 3, title: "Open Face", icon: <FaShieldAlt />,path:'/helmet&safty-accessories/category/open-face' },
          { id: 4, title: "Half Face", icon: <RiShieldStarFill />,path:'/helmet&safty-accessories/category/half-face' },
        ],
      },
    
      {
        id: 6,
        title: "Reliance Safety (PPE)",
        icon: <MdHealthAndSafety />,
        categories: [
          { id: 1, title: "Safety Helmets (Hard Hats)", icon: <FaShieldAlt />,path:'/helmet&safty-accessories/category/safety-helmets' },
          { id: 2, title: "Safety Goggles / Face Shields", icon: <FaGlasses />,path:'/helmet&safty-accessories/category/safety-goggles' },
          { id: 3, title: "Hearing Protection", icon: <FaDeaf />,path:'/helmet&safty-accessories/category/hearing-protection' },
          { id: 4, title: "Safety Gloves", icon: <FaHandPaper />,path:'/helmet&safty-accessories/category/safety-gloves' },
          { id: 5, title: "Safety Shoes / Gumboots", icon: <FaShoePrints />,path:'/helmet&safty-accessories/category/safety-shoes' },
          { id: 6, title: "High-Visibility Vests / Jackets", icon: <FaVest />,path:'/helmet&safty-accessories/category/high-visibility-vests' },
          { id: 7, title: "Respirators / Masks", icon: <GiGasMask />,path:'/helmet&safty-accessories/category/respirators-masks' },
          { id: 8, title: "Coveralls / Protective Suits", icon: <GiBeltArmor />,path:'/helmet&safty-accessories/category/coveralls-protective-suits' },
          { id: 9, title: "Fall Protection Harness", icon: <GiFallDown />,path:'/helmet&safty-accessories/category/fall-protection-harness' },
          { id: 10, title: "Welding Helmets & Gloves", icon: <MdMasks />,path:'/helmet&safty-accessories/category/welding-helmets-gloves' },
        ],
      },
      
    ],

  '/agro&fisheries': [
    { id: 1, title: "Dashboard", icon: <MdDashboard />, path:'/agro&fisheries' },
    { id: 2, title: "Add Product", icon: <MdShoppingCart />, path:'/agro&fisheries/add-product' },
    { id: 3, title: "All Products", icon: <MdInventory2 />, path:'/agro&fisheries/all-products' },
    { id: 4, title: "Featured Products", icon: <MdWorkspacePremium />, path:'/agro&fisheries/featured-products' },
    { id: 5, title: "Product Category", icon: <MdCategory />,
      categories:[
          { id: 1, title: "Fruits", icon: <FaAppleAlt />, path:'/agro&fisheries/category/fruits' },
          { id: 2, title: "Vegetables", icon: <FaCarrot />, path:'/agro&fisheries/category/vegetables' },
          { id: 3, title: "Dairy", icon: <FaCheese />, path:'/agro&fisheries/category/dairy' },
          { id: 4, title: "Meat", icon: <FaDrumstickBite />, path:'/agro&fisheries/category/meat' },
          { id: 5, title: "Grains", icon: <FaBreadSlice />, path:'/agro&fisheries/category/grains' },
          { id: 6, title: "Seafood", icon: <GiShrimp />, path:'/agro&fisheries/category/seafood' },
          { id: 7, title: "Fish", icon: <FaFish />, path:'/agro&fisheries/category/fish' },
          { id: 8, title: "Fish Fry", icon: <GiFishEggs />, path:'/agro&fisheries/category/fish-fry' }, // মাছের পোনা
          { id: 9, title: "Fish Eggs (Roe)", icon: <GiFishEggs />, path:'/agro&fisheries/category/fish-eggs' }, // মাছের ডিম
          ]
     },
  
    ],
  '/sazin-construction': [
    { id: 1, title: "Dashboard", icon: <MdDashboard />, path: '/sazin-construction' },
    { id: 2, title: "Add Project", icon: <MdShoppingCart />, path: '/sazin-construction/add-project' },
  
     {
      id: 7,
      title: "All Projects",
      icon: <MdInventory2 />,
      path: '/sazin-construction/all-projects'
    },
    {
      id: 8,
      title: "Featured Projects",
      icon: <MdWorkspacePremium />,
      path: '/sazin-construction/featured-projects'
    },
    {
      id: 9,
      title: "Project Category",
      icon: <MdCategory />,
      categories: [
        {
          id: 1,
          title: "Electro-Mechanical",
          icon: <FaTools />, // Tools = Electro-mechanical
          path: '/sazin-construction/category/electro-mechanical'
        },
        {
          id: 2,
          title: "Civil",
          icon: <FaBuilding />, // Building = Civil works
          path: '/sazin-construction/category/civil'
        },
        {
          id: 3,
          title: "Engineering Procurement",
          icon: <FaDraftingCompass />, // Compass = Engineering/Procurement
          path: '/sazin-construction/category/engineering-procurement'
        },
        {
          id: 4,
          title: "Safety & Security",
          icon: <FaShieldAlt />, // Shield = Safety & Security
          path: '/sazin-construction/category/safety-security'
        },
        {
          id: 5,
          title: "Agro",
          icon: <FaShieldAlt />, // Shield = Safety & Security
          path: '/sazin-construction/category/Agro'
        },
        {
          id: 6,
          title: "PWD",
          icon: <FaShieldAlt />, // Shield = Safety & Security
          path: '/sazin-construction/category/PWD'
        },
        {
          id: 7,
          title: "PGCB",
          icon: <FaShieldAlt />, // Shield = Safety & Security
          path: '/sazin-construction/category/PGCB'
        },
        {
          id: 8,
          title: "NHA",
          icon: <FaShieldAlt />, // Shield = Safety & Security
          path: '/sazin-construction/category/NHA'
        },
        {
          id: 9,
          title: "BPC",
          icon: <FaShieldAlt />, // Shield = Safety & Security
          path: '/sazin-construction/category/BPC'
        },
        {
          id: 10,
          title: "EED",
          icon: <FaShieldAlt />, // Shield = Safety & Security
          path: '/sazin-construction/category/EED'
        },
        {
          id: 11,
          title: "LGED",
          icon: <FaShieldAlt />, // Shield = Safety & Security
          path: '/sazin-construction/category/LGED'
        },
      ]
    },
  
     {id:5, title: "Certifications", icon: <MdShoppingCart />, path: '/sazin-construction/certifications',
        categories:[
            {id:1, title:"Add Certification", icon:<FaTools/>, path:'/sazin-construction/certifications/add-certification'},
            {id:2, title:"Manage Certification", icon:<FaTools/>, path:'/sazin-construction/certifications/manage-certification'},
        ]
     },
  
     {id:6, title: "Achievements", icon: <MdShoppingCart />, path: '/sazin-construction/achievement',
        categories:[
            {id:1, title:"Add Achievement", icon:<FaTools/>, path:'/sazin-construction/achievement/add-achievement'},
            {id:2, title:"Manage Achievement", icon:<FaTools/>, path:'/sazin-construction/achievement/manage-achievement'},
        ]
     },
  
       {
      id:12 ,title: 'Clients & partners', icon: <MdShoppingCart />, path: '/sazin-construction/clients&partners',
      categories:[
          {id:1, title:"Add Client", icon:<FaTools/>, path:'/sazin-construction/clients&partners/add-client'},
          {id:2, title:"Manage Clients", icon:<FaTools/>, path:'/sazin-construction/clients&partners/manage-clients'},
      ]
    },
  
    { id: 3, title: "News", icon: <MdShoppingCart />, path: '/sazin-construction/add-news',
         categories:[
               { id: 1, title: "Add News", icon: <FaTools />, path: '/sazin-construction/news/add-news' },
               { id: 2, title: "Manage News", icon: <FaTools />, path: '/sazin-construction/news/manage-news' },
         ]
     },
    { id: 4, title: "Jobs", icon: <MdShoppingCart />, path: '/sazin-construction/post-job',
       categories:[
           {id:1, title:"Post Job", icon:<FaTools/>, path:'/sazin-construction/jobs/post-job'},
           {id:2, title:"Manage Job", icon:<FaTools/>, path:'/sazin-construction/jobs/manage-job'},
       ]
     },
    {
      id:11, title: 'Equipment', icon: <MdShoppingCart />, path: '/sazin-construction/equipment',
      categories:[
          {id:1, title:"Add Equipment", icon:<FaTools/>, path:'/sazin-construction/equipment/add-equipment'},
          {id:2, title:"Manage Equipment", icon:<FaTools/>, path:'/sazin-construction/equipment/manage-equipment'},
      ]
    },
  
    {
      id:13, title: 'Services', icon: <MdShoppingCart />, path: '/sazin-construction/services',
      categories:[
          {id:1, title:"Add Service", icon:<FaTools/>, path:'/sazin-construction/services/add-service'},
          {id:2, title:"Manage Services", icon:<FaTools/>, path:'/sazin-construction/services/manage-services'},
      ]
    }
  ],

}

const colorMap = {
  'agro&fisheries': {
    root: '/agro&fisheries',
    bgColor: 'bg-green-800',
    textColor: 'text-gray-100',
    cardBorder: 'border-2 border-green-500',
    sidebarActive: 'bg-white text-black',
    navbar: 'bg-white shadow-md',
    active: 'bg-green-700 text-white',
    hover: 'hover:bg-black hover:text-white',
    accent: 'text-green-600',
    formBg: 'bg-white',
    formButton: 'bg-green-600 hover:bg-green-700',
    formInput: 'border-green-300 focus:ring-2 focus:ring-green-400',
    formLabel: 'text-green-800',
    imageCard:
      'border-2 border-green-300 rounded-xl p-6 hover:shadow-lg transition',
  },

  'helmet&safty-accessories': {
    root: '/helmet&safty-accessories',
    bgColor: 'bg-blue-800',
    // mainBg: 'bg-blue-100',
    textColor: 'text-gray-100',
    cardBorder: 'border border-blue-200',
    navbar: 'bg-white shadow-md',
    sidebarActive: 'bg-white text-black',
    active: 'bg-blue-800 text-white',
    hover: 'hover:bg-black hover:text-white',
    accent: 'text-blue-600',
    formBg: 'bg-white',
    formButton: 'bg-blue-600 hover:bg-blue-700',
    formInput: 'border-blue-300 focus:ring-2 focus:ring-blue-400',
    formLabel: 'text-blue-800',
    imageCard:
      'border-2 border-blue-300 rounded-xl p-6 hover:shadow-lg transition',
  },
  'sazin-construction': {
    root: '/sazin-construction',
    bgColor: 'bg-blue-800',
    mainBg: 'bg-blue-100',
    textColor: 'text-gray-100',
    cardBorder: 'border border-blue-200',
    navbar: 'bg-white shadow-md',
    sidebarActive: 'bg-white text-black',
    active: 'bg-blue-800 text-white',
    hover: 'hover:bg-black hover:text-white',
    accent: 'text-blue-600',
    formBg: 'bg-white',
    formButton: 'bg-blue-600 hover:bg-blue-700',
    formInput: 'border-blue-300 focus:ring-2 focus:ring-blue-400',
    formLabel: 'text-blue-800',
    imageCard:
      'border-2 border-blue-300 rounded-xl p-6 hover:shadow-lg transition',
  },
  '/': {
    root: '/',
    bgColor: 'bg-blue-800',
    mainBg: 'bg-blue-100',
    textColor: 'text-gray-100',
    cardBorder: 'border border-blue-200',
    navbar: 'bg-white shadow-md',
    sidebarActive: 'bg-white text-black',
    active: 'bg-blue-800 text-white',
    hover: 'hover:bg-black hover:text-white',
    accent: 'text-blue-600',
    formBg: 'bg-white',
    formButton: 'bg-blue-600 hover:bg-blue-700',
    formInput: 'border-blue-300 focus:ring-2 focus:ring-blue-400',
    formLabel: 'text-blue-800',
    imageCard:
      'border-2 border-blue-300 rounded-xl p-6 hover:shadow-lg transition',
  },
};

  const decryptData =(ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext,process.env.NEXT_PUBLIC_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

const getUser = async () => {
  const data = await localforage.getItem("user");
  if (!data) return null;
  if (Date.now() > data.expiryTime) {
    // Expired হলে মুছে ফেলবে
    await localforage.removeItem("user");
    return null;
  }

  return data;
};

const addUser = async (user) => {
   if(!user || !user.uid) return null;
   user.email=decryptData(user?.email);
   user.username=decryptData(user?.username);
    // expire time (7 days = 7*24*60*60*1000 ms)
   user.expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
  const res= await localforage.setItem('user', user);
  return res;
};


const removeUser = async () => {
  await localforage.removeItem('user');
};



export function SidebarProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loader state

  useEffect(() => {
      (async () => {
        setLoading(true); // start loading
        const user = await getUser();
        if (user) {
          await setUserInterceptor(user); // axios interceptor update
          setUser(user);   // এখানে object wrap না করে সরাসরি দিচ্ছি
        } else {
          await setUserInterceptor(null); // axios interceptor update
          setUser(false);
        }
        setLoading(false); // cookie check complete
      })();
  }, []);

  const login = async (user) => {
    setLoading(true); // start loading
    await setUserInterceptor(user); // axios interceptor update
    const res = await addUser(user);
    if(!res){ setUser(null);setLoading(false); return};
    setUser(user);
    setLoading(false); // cookie check complete
  };

  const logout = async() => {
    setLoading(true); // start loading
    try{
     const res= await axiosInstance.post("Auth0784T/logout")
     console.log(res);
     
      toast.success(res?.response?.data?.message || '')
      await setUserInterceptor(null); // axios interceptor update
      await removeUser();
      setUser(null);
    }catch(err){
      toast.error(err?.response?.data.message || "request failed")
    }finally{
      setLoading(false); // cookie check complete
    }
  };

   const updateJWT = async (user) => {
    user.email=decryptData(user?.email);
    user.username=decryptData(user?.username);
    // expire time (7 days = 7*24*60*60*1000 ms)
   user.expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
   const res= await localforage.setItem('user', user);
   if(!res) {
      await setUserInterceptor(user); // axios interceptor update
      setUser(user);
   }else{
    await setUserInterceptor(user); // axios interceptor update
    setUser(user);
   }
}
  const [items, setItems] = useState([]); // default empty sidebar
  const [dynamicTheme, setDynamicTheme] = useState({ bgColor: '', textColor: '' });
  const pathName = usePathname();
  useEffect(() => {
    if(!pathName) return; // pathName is undefined on first render
    // Set dynamic sidebar
 
     if (pathName.startsWith('/agro&fisheries')) {
      setItems(Sidebarlist['/agro&fisheries']);
      setDynamicTheme(colorMap['agro&fisheries']);
    } else if (pathName.startsWith('/sazin-construction')) {
      setItems(Sidebarlist['/sazin-construction']);
      setDynamicTheme(colorMap['sazin-construction']);
    } else if (pathName.startsWith('/helmet&safty-accessories')) {
      setItems(Sidebarlist['/helmet&safty-accessories']);
      setDynamicTheme(colorMap['helmet&safty-accessories']);
    } else if (pathName.startsWith('/')) {
      setItems(Sidebarlist['/']);
      setDynamicTheme(colorMap['/']);
    } else {
      setItems([]);
      setDynamicTheme({ bgColor: '', textColor: '' });
    }
  }, [pathName]);

  return (
    <SidebarContext.Provider value={{ items, dynamicTheme,user,updateJWT, login, logout, loading }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
