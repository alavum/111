import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CreditCard, Upload, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VipPlan {
  name: string;
  price: string;
  duration: string;
  popular?: boolean;
  discount?: string;
}

interface VipPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: VipPlan | null;
}

const paymentMethods = [
  {
    id: "tbank",
    name: "Т-Банк",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGREIwMCIvPgo8cGF0aCBkPSJNMTAgMTJIMzBWMTRIMjhWMjZIMjZWMjhIMTRWMjZIMTJWMTRIMTBWMTJaIiBmaWxsPSIjMDAwIi8+CjxwYXRoIGQ9Ik0xNiAxNkgyNFYxOEgyMlYyMkgyMFYyNEgxOFYyMkgxNlYxNloiIGZpbGw9IiMwMDAiLz4KPC9zdmc+",
    cardNumber: "2200 1234 5678 9012",
    cardHolder: "RSGS PAYMENTS",
    description: "Переводы на карту Т-Банк",
  },
  {
    id: "sbp",
    name: "СБП (Т-Банк)",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwN0FGRiIvPgo8cGF0aCBkPSJNMTIgMTJIMjhWMTRIMjZWMjZIMjhWMjhIMTJWMjZIMTBWMTRIMTJWMTJaIiBmaWxsPSIjRkZGIi8+CjxwYXRoIGQ9Ik0xNiAxNkgyNFYyNEgxNlYxNloiIGZpbGw9IiNGRkYiLz4KPC9zdmc+",
    cardNumber: "+7 932 257 80 92",
    cardHolder: "Система быстрых платежей (Т-Банк)",
    description: "Перевод через СБП в Т-Банк по номеру телефона",
  },
];

export default function VipPaymentModal({ isOpen, onClose, selectedPlan }: VipPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState("tbank");
  const [playerData, setPlayerData] = useState({
    steamId: "",
    discordId: "",
    screenshot: null as File | null,
    comment: "",
  });
  const [step, setStep] = useState(1); // 1: payment info, 2: confirmation
  const [uploading, setUploading] = useState(false);

  const handleCopyCard = async (cardNumber: string) => {
    try {
      await navigator.clipboard.writeText(cardNumber.replace(/\s/g, ""));
      toast({
        title: "Скопировано!",
        description: "Номер карты скопирован в буфер обмена",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать номер карты",
        variant: "destructive",
      });
    }
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Файл слишком большой",
          description: "Максимальный размер файла: 5MB",
          variant: "destructive",
        });
        return;
      }
      setPlayerData(prev => ({ ...prev, screenshot: file }));
    }
  };

  const handleSubmitPayment = async () => {
    if (!playerData.steamId || !playerData.screenshot) {
      toast({
        title: "Заполните ��бязательные поля",
        description: "Steam ID и скриншот перевода обязательны",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('steamId', playerData.steamId);
      formData.append('discordId', playerData.discordId || '');
      formData.append('comment', playerData.comment || '');
      formData.append('screenshot', playerData.screenshot);
      formData.append('plan', JSON.stringify(selectedPlan));
      formData.append('paymentMethod', selectedMethod);

      const response = await fetch('/api/vip-applications', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStep(2);
        toast({
          title: "Заявка отправлена!",
          description: "Ваша заявка на VIP статус принята к рассмотрению",
        });
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setPlayerData({
      steamId: "",
      discordId: "",
      screenshot: null,
      comment: "",
    });
    onClose();
  };

  if (!selectedPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] bg-gaming-card border-gaming-border text-gaming-text overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gaming-accent">
            Оплата VIP статуса
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Selected Plan */}
            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-4">
              <h3 className="font-semibold text-gaming-text mb-2">Выбранный план:</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gaming-accent font-bold">{selectedPlan.name}</p>
                  <p className="text-gaming-text-muted text-sm">{selectedPlan.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gaming-accent">{selectedPlan.price}</p>
                  {selectedPlan.discount && (
                    <p className="text-green-400 text-sm">{selectedPlan.discount}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold text-gaming-text mb-4">Способ оплаты:</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? "border-gaming-accent bg-gaming-accent/10"
                        : "border-gaming-border hover:border-gaming-accent/50"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={method.icon}
                          alt={method.name}
                          className="w-10 h-10 rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'block';
                          }}
                        />
                        <span className="text-2xl hidden">💳</span>
                        <div>
                          <p className="font-semibold text-gaming-text">{method.name}</p>
                          <p className="text-gaming-text-muted text-sm">{method.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-gaming-text text-lg">{method.cardNumber}</p>
                        <p className="text-gaming-text-muted text-sm">{method.cardHolder}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCard(method.cardNumber);
                          }}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Копировать
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-4">
              <h4 className="font-semibold text-gaming-accent mb-2">Инструкции по оплате:</h4>
              <ol className="text-gaming-text-muted text-sm space-y-2">
                <li>1. Переведите точную сумму {selectedPlan.price} на указанную карт��</li>
                <li>2. Сделайте скриншот подтверждения перевода</li>
                <li>3. Заполните форму ниже и загрузите скриншот</li>
                <li>4. Дождитесь подтверждения (обычно в течение 1-24 часов)</li>
              </ol>
            </div>

            {/* Player Data Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gaming-text">Данные игрока:</h3>
              
              <div>
                <Label htmlFor="steamId" className="text-gaming-text">
                  Steam ID <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="steamId"
                  value={playerData.steamId}
                  onChange={(e) => setPlayerData(prev => ({ ...prev, steamId: e.target.value }))}
                  placeholder="76561198000000000"
                  className="bg-gaming-bg border-gaming-border text-gaming-text"
                />
                <p className="text-gaming-text-muted text-xs mt-1">
                  Найти Steam ID можно на steamid.io
                </p>
              </div>

              <div>
                <Label htmlFor="discordId" className="text-gaming-text">Discord ID</Label>
                <Input
                  id="discordId"
                  value={playerData.discordId}
                  onChange={(e) => setPlayerData(prev => ({ ...prev, discordId: e.target.value }))}
                  placeholder="123456789012345678"
                  className="bg-gaming-bg border-gaming-border text-gaming-text"
                />
              </div>

              <div>
                <Label htmlFor="screenshot" className="text-gaming-text">
                  Скриншот перевода <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="bg-gaming-bg border-gaming-border text-gaming-text"
                />
                {playerData.screenshot && (
                  <p className="text-green-400 text-sm mt-1">
                    ✓ Файл загружен: {playerData.screenshot.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="comment" className="text-gaming-text">Комментарий</Label>
                <Textarea
                  id="comment"
                  value={playerData.comment}
                  onChange={(e) => setPlayerData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Дополнительная информация (необязательно)"
                  className="bg-gaming-bg border-gaming-border text-gaming-text"
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleSubmitPayment}
                className="flex-1 bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Отправить заявку
                  </>
                )}
              </Button>
              <Button
                onClick={resetModal}
                variant="outline"
                className="border-gaming-border text-gaming-text hover:bg-gaming-card"
              >
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          // Step 2: Confirmation
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gaming-text mb-4">
              Заявка успешно отправлена!
            </h3>
            <p className="text-gaming-text-muted mb-6">
              Ваша заявка на получение VIP статуса "{selectedPlan.name}" принята к рассмотрению.
              Обычно обработка занимает от 1 до 24 часов.
            </p>
            <div className="bg-gaming-bg border border-gaming-border rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gaming-text mb-2">Что дальше?</h4>
              <ul className="text-gaming-text-muted text-sm space-y-1 text-left">
                <li>• Администратор проверит ваш перевод</li>
                <li>• При подтверждении VIP статус будет активирован</li>
                <li>• Вы получите уведомление в Discord</li>
                <li>• При возникновении вопросов свяжемся с вами</li>
              </ul>
            </div>
            <Button
              onClick={resetModal}
              className="bg-gaming-accent hover:bg-gaming-accent-hover text-black"
            >
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
