import LatexInteractiveTransformerArchitecture from "@/components/scientific-transformer-architecture";

export default function TransformerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Transformer Architecture: A Scientific Analysis</h1>
      <LatexInteractiveTransformerArchitecture />
    </div>
  )
}