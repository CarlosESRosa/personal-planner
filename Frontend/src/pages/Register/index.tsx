import PrimaryButton from "../../components/ui/PrimaryButton";

export default function Example() {
    return (
        <div className="space-y-4 p-6 bg-bg">
            <PrimaryButton onClick={() => alert("Oi!")}>
                Salvar alterações
            </PrimaryButton>

            <PrimaryButton disabled>
                Carregando...
            </PrimaryButton>
        </div>
    );
}
