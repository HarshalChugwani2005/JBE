export default function ProductDetailModal({ isOpen, onClose, product }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">
          {product?.modelName ?? 'Product Detail'}
        </h2>
        <p className="mt-2 text-sm text-gray-500">Modal stub — Day 3 implementation</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  )
}
