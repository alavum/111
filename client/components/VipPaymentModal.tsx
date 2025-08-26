import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    id: "yukassa",
    name: "ЮKassa",
    icon: "https://cdn.builder.io/api/v1/image/assets%2F9371a00d52894c5d9ce9e006bf6e8168%2F085c41bea03e41bd98a089b641edb7f7?format=webp&width=800",
    cardNumber: "Онлайн-оплата",
    cardHolder: "ЮKassa (безопасные платежи)",
    description: "Оплата картой через ЮKassa",
  },
];

export default function VipPaymentModal({
  isOpen,
  onClose,
  selectedPlan,
}: VipPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState("yukassa");
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [playerData, setPlayerData] = useState({
    steamId: "",
    discordId: "",
    screenshot: null as File | null,
    comment: "",
  });
  const [step, setStep] = useState(1); // 1: payment info, 2: confirmation
  const [uploading, setUploading] = useState(false);

  // Calculate price based on months
  const calculatePrice = () => {
    if (!selectedPlan?.basePrice) return 0;
    const basePrice = selectedPlan.basePrice;
    let totalPrice = basePrice * selectedMonths;

    // Apply discounts
    if (selectedMonths >= 12) {
      totalPrice = totalPrice * 0.78; // 22% discount
    } else if (selectedMonths >= 6) {
      totalPrice = totalPrice * 0.83; // 17% discount
    } else if (selectedMonths >= 3) {
      totalPrice = totalPrice * 0.89; // 11% discount
    }

    return Math.round(totalPrice);
  };

  const getDiscountText = () => {
    if (selectedMonths >= 12) return "Скидка 22%";
    if (selectedMonths >= 6) return "Скидка 17%";
    if (selectedMonths >= 3) return "Скидка 11%";
    return null;
  };

  const handleCopyCard = async (cardNumber: string) => {
    try {
      await navigator.clipboard.writeText(cardNumber.replace(/\s/g, ""));
      toast({
        title: "Скопировано!",
        description: "Номер карты скопи��ован в буфер обмена",
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

  const handleScreenshotUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Файл слишком большой",
          description: "Максимальный размер файла: 5MB",
          variant: "destructive",
        });
        return;
      }
      setPlayerData((prev) => ({ ...prev, screenshot: file }));
    }
  };

  const handleSubmitPayment = async () => {
    if (!playerData.steamId || (selectedMethod === "tbank" && !playerData.screenshot)) {
      toast({
        title: "Заполните обязательные поля",
        description: selectedMethod === "tbank" ? "Steam ID и скриншот перевода обязательны" : "Steam ID обязателен",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append("steamId", playerData.steamId);
      formData.append("discordId", playerData.discordId || "");
      formData.append("comment", playerData.comment || "");
      formData.append("screenshot", playerData.screenshot);
      formData.append(
        "plan",
        JSON.stringify({
          ...selectedPlan,
          months: selectedMonths,
          totalPrice: calculatePrice(),
          discount: getDiscountText(),
        }),
      );
      formData.append("paymentMethod", selectedMethod);

      const response = await fetch("/api/vip-applications", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStep(2);
        toast({
          title: "Заявка отправлена!",
          description: "Ва��а заявка на VIP статус принята к рассмотрению",
        });
      } else {
        throw new Error("Server error");
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
    setSelectedMonths(1);
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
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] bg-gaming-card border-gaming-border text-gaming-text overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-gaming-accent">
            Оплата VIP статуса
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          {step === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selected Plan */}
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gaming-text mb-2 text-sm">
                  Выбранный план:
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gaming-accent font-bold text-sm">
                      {selectedPlan.name}
                    </p>
                    <p className="text-gaming-text-muted text-xs">
                      {selectedPlan.description}
                    </p>
                  </div>
                </div>

                {/* Duration Selection */}
                <div>
                  <Label className="text-gaming-text text-xs">
                    Срок действия:
                  </Label>
                  <Select
                    value={selectedMonths.toString()}
                    onValueChange={(value) =>
                      setSelectedMonths(parseInt(value))
                    }
                  >
                    <SelectTrigger className="bg-gaming-card border-gaming-border text-gaming-text text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gaming-card border-gaming-border">
                      <SelectItem value="1">1 месяц</SelectItem>
                      <SelectItem value="3">3 месяца</SelectItem>
                      <SelectItem value="6">6 месяцев</SelectItem>
                      <SelectItem value="12">12 месяцев</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gaming-border">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gaming-accent">
                      {calculatePrice()} ₽
                    </p>
                    {getDiscountText() && (
                      <p className="text-green-400 text-xs">
                        {getDiscountText()}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gaming-text-muted">
                    {selectedPlan.basePrice} ₽/мес × {selectedMonths} мес.
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold text-gaming-text mb-3 text-sm">
                  Способ оплаты:
                </h3>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? "border-gaming-accent bg-gaming-accent/10"
                          : "border-gaming-border hover:border-gaming-accent/50"
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={method.icon}
                            alt={method.name}
                            className="w-8 h-8 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling!.style.display =
                                "block";
                            }}
                          />
                          <span className="text-xl hidden">💳</span>
                          <div>
                            <p className="font-semibold text-gaming-text text-sm">
                              {method.name}
                            </p>
                            <p className="text-gaming-text-muted text-xs">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-gaming-text text-sm">
                            {method.cardNumber}
                          </p>
                          <p className="text-gaming-text-muted text-xs">
                            {method.cardHolder}
                          </p>
                          {method.id === "yukassa" && (
                            <div className="mt-2 text-gaming-accent text-xs">
                              Банковские карты, электронные кошельки
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-3">
                <h4 className="font-semibold text-gaming-accent mb-2 text-sm">
                  Инструкции по оплате:
                </h4>
                <ol className="text-gaming-text-muted text-xs space-y-1">
                  <li>
                    1. Нажмите "Отправить заявку" для перехода к оплате
                  </li>
                  <li>2. Оплатите {calculatePrice()} ₽ через ЮKassa</li>
                  <li>3. Заполните данные игрока в форме ниже</li>
                  <li>
                    4. Дождитесь подтверждения (обычно в течение 1-24 часов)
                  </li>
                </ol>
              </div>

              {/* Player Data Form */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gaming-text text-sm">
                  Данные игрока:
                </h3>

                <div>
                  <Label htmlFor="steamId" className="text-gaming-text text-sm">
                    Steam ID <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="steamId"
                    value={playerData.steamId}
                    onChange={(e) =>
                      setPlayerData((prev) => ({
                        ...prev,
                        steamId: e.target.value,
                      }))
                    }
                    placeholder="76561198000000000"
                    className="bg-gaming-bg border-gaming-border text-gaming-text"
                  />
                  <p className="text-gaming-text-muted text-xs mt-1">
                    Найти Steam ID можно н�� steamid.io
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="discordId"
                    className="text-gaming-text text-sm"
                  >
                    Discord ID
                  </Label>
                  <Input
                    id="discordId"
                    value={playerData.discordId}
                    onChange={(e) =>
                      setPlayerData((prev) => ({
                        ...prev,
                        discordId: e.target.value,
                      }))
                    }
                    placeholder="123456789012345678"
                    className="bg-gaming-bg border-gaming-border text-gaming-text"
                  />
                </div>

                {selectedMethod !== "yukassa" && (
                  <div>
                    <Label
                      htmlFor="screenshot"
                      className="text-gaming-text text-sm"
                    >
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
                      <p className="text-green-400 text-xs mt-1">
                        ✓ Файл за��ружен: {playerData.screenshot.name}
                      </p>
                    )}
                  </div>
                )}

                {selectedMethod !== "yukassa" && (
                  <div>
                    <Label htmlFor="comment" className="text-gaming-text text-sm">
                      Комментарий
                    </Label>
                    <Textarea
                      id="comment"
                      value={playerData.comment}
                      onChange={(e) =>
                        setPlayerData((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Дополнительная информация (необязательно)"
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-3 lg:col-span-2">
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
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gaming-text mb-3">
                Заявка ��спешно отправлена!
              </h3>
              <p className="text-gaming-text-muted mb-4 text-sm">
                Ваша заявка на получение VIP статуса "{selectedPlan.name}" на{" "}
                {selectedMonths}{" "}
                {selectedMonths === 1
                  ? "месяц"
                  : selectedMonths < 5
                    ? "месяца"
                    : "месяцев"}{" "}
                принята к рассмотрению. Сумма: {calculatePrice()} ₽. Обычно
                обработка занимает от 1 до 24 часов.
              </p>
              <div className="bg-gaming-bg border border-gaming-border rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-gaming-text mb-2 text-sm">
                  Чт�� дальше?
                </h4>
                <ul className="text-gaming-text-muted text-xs space-y-1 text-left">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
