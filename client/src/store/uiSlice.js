import { createSlice } from "@reduxjs/toolkit";

// Fonction de récupération sécurisée du thème depuis localStorage
// Essaie de récupérer et parser le thème stocké localement pour restaurer la configuration utilisateur.
// Si une erreur survient (ex: JSON mal formé), on attribue null pour éviter un plantage.
let savedTheme;
try {
  savedTheme = JSON.parse(localStorage.getItem("theme"));
} catch (e) {
  savedTheme = null;
}

// État initial du slice UI, contenant les états des modaux et le thème actif.
// Le thème initial est soit celui récupéré depuis localStorage, soit un thème vide par défaut.
const initialState = {
  themeModalIsOpen: false,       // Indique si la fenêtre modale de choix du thème est ouverte
  editProfileModalOpen: false,   // Indique si la modale d'édition du profil est ouverte
  editPostModalOpen: false,      // Indique si la modale d'édition d'un post est ouverte
  editPostId: "",                // Stocke l'ID du post en cours d'édition
  theme: savedTheme || {         // Le thème actuel, soit celui sauvegardé, soit un thème par défaut vide
    primaryColor: "",
    backgroundColor: "",
  }
};

// Création du slice Redux "ui" qui gère l'état UI global
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Ouvre la modale de sélection de thème
    openThemeModal: state => {
      state.themeModalIsOpen = true;
    },
    // Ferme la modale de sélection de thème
    closeThemeModal: state => {
      state.themeModalIsOpen = false;
    },
    // Change le thème courant et persiste la nouvelle valeur dans localStorage
    changeTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", JSON.stringify(action.payload));
    },
    // Ouvre la modale d'édition de profil
    openEditProfileModal: state => {
      state.editProfileModalOpen = true;
    },
    // Ferme la modale d'édition de profil
    closeEditProfileModal: state => {
      state.editProfileModalOpen = false;
    },
    // Ouvre la modale d'édition de post et stocke l'ID du post à éditer
    openEditPostModal: (state, action) => {
      state.editPostModalOpen = true;
      state.editPostId = action.payload;
    },
    // Ferme la modale d'édition de post
    closeEditPostModal: state => {
      state.editPostModalOpen = false;
    }
  }
});

// Export des actions générées par createSlice pour être utilisées dans les composants
export const uiSliceActions = uiSlice.actions;

// Export du reducer à connecter au store Redux
export default uiSlice;
