import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { NotaFiscalCompra } from "@/types/interfaces/entities"
import { NotaFiscalVenda } from "@prisma/client"
import { Receipt, X } from "lucide-react"

export const HeaderNotaModal = ({ nota }: { nota: NotaFiscalCompra | NotaFiscalVenda }) => {

    const isCompra = 'fornecedorId' in nota

    return (
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
                <Receipt className="h-8 w-8 text-blue-600" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nota Fiscal</h1>
                    <p className="text-sm text-gray-500">{isCompra ? "Compra" : "Venda"} #{nota.id}</p>
                </div>
            </div>
        </div>
    )
}