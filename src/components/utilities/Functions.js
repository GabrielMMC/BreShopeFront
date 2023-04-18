import { toast } from "react-toastify"
import { renderToast } from "./Alerts"
import { DELETE_FETCH, POST_FETCH, URL } from "../../variables"

export const handleAddWishlist = async (id, product, products, errorTimer, setErrorTimer, onAddWishlist) => {
  const token = localStorage.getItem('token')

  if (token) {
    if (!products.filter(item => item.id === id)[0]) {
      onAddWishlist([...products, { ...product }]);
      await POST_FETCH({ url: `${URL}api/wishlists/create`, body: { product_id: id }, token })
    }
  } else {
    if (!errorTimer) {
      setErrorTimer(true)
      renderToast({ type: 'error', error: 'Faça login para adicionar um produto à lista de desejos!' })
      setTimeout(() => setErrorTimer(false), 3000)
    }
  }
}

export const handleDeleteWishlist = async (id, products, onDeleteWishlist) => {
  const token = localStorage.getItem('token')
  onDeleteWishlist(products.filter(item => item.id !== id));
  await DELETE_FETCH({ url: `wishlists/delete/${id}`, token })
}

export const copyLink = (link) => {
  navigator.clipboard.writeText(link);
  toast.info('Link copiado com sucesso!', {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};