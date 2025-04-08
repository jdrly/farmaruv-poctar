'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useRef, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define types for our expense and income items
interface CalculatorItem {
  id: string;
  name: string;
  value: number | null;
  note: string;
  isMonthly?: boolean;
  isCustom?: boolean;
  _id?: Id<"expenseItems"> | Id<"incomeItems">;
  order?: number;
}

export function BreederCalculator() {
  // Get data from Convex
  const animalCount = useQuery(api.calculator.getAnimalCount);
  const expenseItemsQuery = useQuery(api.calculator.getExpenses);
  const incomeItemsQuery = useQuery(api.calculator.getIncomes);
  
  // Use useMemo to prevent recreating empty arrays on each render
  const expenseItems = useMemo(() => expenseItemsQuery || [], [expenseItemsQuery]);
  const incomeItems = useMemo(() => incomeItemsQuery || [], [incomeItemsQuery]);
  
  // Check if data is loading
  const isLoading = animalCount === undefined || expenseItems.length === 0 || incomeItems.length === 0;
  
  // Mutations
  const saveAnimalCount = useMutation(api.calculator.saveAnimalCount);
  const saveExpenseItem = useMutation(api.calculator.saveExpenseItem);
  const saveIncomeItem = useMutation(api.calculator.saveIncomeItem);
  const deleteExpenseItem = useMutation(api.calculator.deleteExpenseItem);
  const deleteIncomeItem = useMutation(api.calculator.deleteIncomeItem);
  const initializeCalculator = useMutation(api.calculator.initializeCalculatorForUser);
  
  // Local state
  const [expenses, setExpenses] = useState<CalculatorItem[]>([]);
  const [incomes, setIncomes] = useState<CalculatorItem[]>([]);
  const [localAnimalCount, setLocalAnimalCount] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Debounce timers
  const saveTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Function to debounce database saves
  const debounceSave = (key: string, saveFunction: () => void, delay: number = 800) => {
    if (saveTimersRef.current[key]) {
      clearTimeout(saveTimersRef.current[key]);
    }
    
    saveTimersRef.current[key] = setTimeout(() => {
      saveFunction();
      delete saveTimersRef.current[key];
    }, delay);
  };

  // Initialize data from Convex when available
  useEffect(() => {
    if (!isInitialized && expenseItems.length === 0 && incomeItems.length === 0) {
      initializeCalculator().then(() => {
        setIsInitialized(true);
      });
    }
  }, [expenseItems, incomeItems, isInitialized, initializeCalculator]);

  // Update local state when Convex data changes
  useEffect(() => {
    if (animalCount !== undefined) {
      setLocalAnimalCount(animalCount);
    }
  }, [animalCount]);

  useEffect(() => {
    if (expenseItems && expenseItems.length > 0) {
      const mappedExpenses = expenseItems.map(item => ({
        id: item.itemId,
        name: item.name,
        value: item.value ?? null,
        note: item.note,
        isMonthly: item.isMonthly,
        isCustom: item.isCustom,
        _id: item._id,
        order: item.order
      }));
      setExpenses(mappedExpenses);
    }
  }, [expenseItems]);

  useEffect(() => {
    if (incomeItems && incomeItems.length > 0) {
      const mappedIncomes = incomeItems.map(item => ({
        id: item.itemId,
        name: item.name,
        value: item.value ?? null,
        note: item.note,
        isMonthly: item.isMonthly,
        isCustom: item.isCustom,
        _id: item._id,
        order: item.order
      }));
      setIncomes(mappedIncomes);
    }
  }, [incomeItems]);

  // Handle expense name changes for custom items
  const handleExpenseNameChange = (id: string, name: string) => {
    // Update local state immediately
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, name } : expense
    ));
    
    // Debounce the database save
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      debounceSave(`expense-name-${id}`, () => {
        saveExpenseItem({
          itemId: id,
          name,
          value: expense.value ?? undefined,
          note: expense.note,
          isMonthly: expense.isMonthly,
          isCustom: expense.isCustom,
          order: expense.order ?? 0
        });
      });
    }
  };

  // Handle income name changes for custom items
  const handleIncomeNameChange = (id: string, name: string) => {
    // Update local state immediately
    setIncomes(incomes.map(income => 
      income.id === id ? { ...income, name } : income
    ));
    
    // Debounce the database save
    const income = incomes.find(i => i.id === id);
    if (income) {
      debounceSave(`income-name-${id}`, () => {
        saveIncomeItem({
          itemId: id,
          name,
          value: income.value ?? undefined,
          note: income.note,
          isMonthly: income.isMonthly,
          isCustom: income.isCustom,
          order: income.order ?? 0
        });
      });
    }
  };

  // Add new custom expense
  const addCustomExpense = () => {
    const newId = `custom-expense-${expenses.filter(e => e.isCustom).length + 1}`;
    const newOrder = Math.max(...expenses.map(e => e.order ?? 0), 0) + 1;
    
    const newExpense = { 
      id: newId, 
      name: 'Vlastní položka', 
      value: null, 
      note: '', 
      isCustom: true,
      order: newOrder
    };
    
    // Update local state immediately
    setExpenses([...expenses, newExpense]);
    
    // Save to database
    saveExpenseItem({
      itemId: newId,
      name: 'Vlastní položka',
      value: undefined,
      note: '',
      isMonthly: false,
      isCustom: true,
      order: newOrder
    });
  };

  // Add new custom income
  const addCustomIncome = () => {
    const newId = `custom-income-${incomes.filter(i => i.isCustom).length + 1}`;
    const newOrder = Math.max(...incomes.map(i => i.order ?? 0), 0) + 1;
    
    const newIncome = { 
      id: newId, 
      name: 'Vlastní položka', 
      value: null, 
      note: '', 
      isCustom: true,
      order: newOrder
    };
    
    // Update local state immediately
    setIncomes([...incomes, newIncome]);
    
    // Save to database
    saveIncomeItem({
      itemId: newId,
      name: 'Vlastní položka',
      value: undefined,
      note: '',
      isMonthly: false,
      isCustom: true,
      order: newOrder
    });
  };

  // Add this state to track values that are being edited
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  // Handle expense value changes with optimized UI updates
  const handleExpenseChange = (id: string, value: number | null) => {
    // Store the raw input value for display purposes
    setEditingValues(prev => ({
      ...prev,
      [id]: value === null ? '' : value.toString()
    }));
    
    // Ensure value is not negative and convert empty input to 0
    const sanitizedValue = value !== null ? Math.max(0, value) : 0;
    
    // Create a copy of expenses to work with
    const updatedExpenses = [...expenses];
    
    // Find the expense to update
    const index = updatedExpenses.findIndex(expense => expense.id === id);
    if (index !== -1) {
      updatedExpenses[index] = { ...updatedExpenses[index], value: sanitizedValue };
      
      // Handle monthly calculations in the same update
      if (id === 'equipment') {
        const monthlyIndex = updatedExpenses.findIndex(expense => expense.id === 'equipment-monthly');
        if (monthlyIndex !== -1) {
          const monthlyValue = sanitizedValue / 12;
          updatedExpenses[monthlyIndex] = { 
            ...updatedExpenses[monthlyIndex], 
            value: monthlyValue
          };
        }
      } else if (id === 'animals') {
        const monthlyIndex = updatedExpenses.findIndex(expense => expense.id === 'animals-monthly');
        if (monthlyIndex !== -1) {
          const monthlyValue = sanitizedValue / 12;
          updatedExpenses[monthlyIndex] = { 
            ...updatedExpenses[monthlyIndex], 
            value: monthlyValue
          };
        }
      }
      
      // Update local state once with all changes
      setExpenses(updatedExpenses);
      
      // Debounce the database save
      const expense = updatedExpenses[index];
      debounceSave(`expense-value-${id}`, () => {
        saveExpenseItem({
          itemId: id,
          name: expense.name,
          value: sanitizedValue,
          note: expense.note,
          isMonthly: expense.isMonthly,
          isCustom: expense.isCustom,
          order: expense.order ?? 0
        });
        
        // Save monthly value to database if needed
        if (id === 'equipment') {
          const monthlyExpense = updatedExpenses.find(e => e.id === 'equipment-monthly');
          if (monthlyExpense) {
            saveExpenseItem({
              itemId: 'equipment-monthly',
              name: monthlyExpense.name,
              value: monthlyExpense.value ?? 0,
              note: monthlyExpense.note,
              isMonthly: monthlyExpense.isMonthly,
              isCustom: monthlyExpense.isCustom,
              order: monthlyExpense.order ?? 0
            });
          }
        } else if (id === 'animals') {
          const monthlyExpense = updatedExpenses.find(e => e.id === 'animals-monthly');
          if (monthlyExpense) {
            saveExpenseItem({
              itemId: 'animals-monthly',
              name: monthlyExpense.name,
              value: monthlyExpense.value ?? 0,
              note: monthlyExpense.note,
              isMonthly: monthlyExpense.isMonthly,
              isCustom: monthlyExpense.isCustom,
              order: monthlyExpense.order ?? 0
            });
          }
        }
      });
    }
  };

  // Handle income value changes with optimized UI updates
  const handleIncomeChange = (id: string, value: number | null) => {
    // Store the raw input value for display purposes
    setEditingValues(prev => ({
      ...prev,
      [id]: value === null ? '' : value.toString()
    }));
    
    // Ensure value is not negative and convert empty input to 0
    const sanitizedValue = value !== null ? Math.max(0, value) : 0;
    
    // Create a copy of incomes to work with
    const updatedIncomes = [...incomes];
    
    // Find the income to update
    const index = updatedIncomes.findIndex(income => income.id === id);
    if (index !== -1) {
      updatedIncomes[index] = { ...updatedIncomes[index], value: sanitizedValue };
      
      // Handle monthly calculations in the same update
      if (id === 'eggs-hatching') {
        const monthlyIndex = updatedIncomes.findIndex(income => income.id === 'eggs-hatching-monthly');
        if (monthlyIndex !== -1) {
          const monthlyValue = sanitizedValue / 12;
          updatedIncomes[monthlyIndex] = { 
            ...updatedIncomes[monthlyIndex], 
            value: monthlyValue
          };
        }
      } else if (id === 'animals-yearly') {
        const monthlyIndex = updatedIncomes.findIndex(income => income.id === 'animals-monthly');
        if (monthlyIndex !== -1) {
          const monthlyValue = sanitizedValue / 12;
          updatedIncomes[monthlyIndex] = { 
            ...updatedIncomes[monthlyIndex], 
            value: monthlyValue
          };
        }
      }
      
      // Update local state once with all changes
      setIncomes(updatedIncomes);
      
      // Debounce the database save
      const income = updatedIncomes[index];
      debounceSave(`income-value-${id}`, () => {
        saveIncomeItem({
          itemId: id,
          name: income.name,
          value: sanitizedValue,
          note: income.note,
          isMonthly: income.isMonthly,
          isCustom: income.isCustom,
          order: income.order ?? 0
        });
        
        // Save monthly value to database if needed
        if (id === 'eggs-hatching') {
          const monthlyIncome = updatedIncomes.find(i => i.id === 'eggs-hatching-monthly');
          if (monthlyIncome) {
            saveIncomeItem({
              itemId: 'eggs-hatching-monthly',
              name: monthlyIncome.name,
              value: monthlyIncome.value ?? 0,
              note: monthlyIncome.note,
              isMonthly: monthlyIncome.isMonthly,
              isCustom: monthlyIncome.isCustom,
              order: monthlyIncome.order ?? 0
            });
          }
        } else if (id === 'animals-yearly') {
          const monthlyIncome = updatedIncomes.find(i => i.id === 'animals-monthly');
          if (monthlyIncome) {
            saveIncomeItem({
              itemId: 'animals-monthly',
              name: monthlyIncome.name,
              value: monthlyIncome.value ?? 0,
              note: monthlyIncome.note,
              isMonthly: monthlyIncome.isMonthly,
              isCustom: monthlyIncome.isCustom,
              order: monthlyIncome.order ?? 0
            });
          }
        }
      });
    }
  };

  // Calculate totals
  const calculateMonthlyExpenses = () => {
    // Remove console logs for production
    // console.log("Expenses being calculated:", expenses);
    
    const monthlyTotal = expenses
      .filter(expense => expense.value !== null)
      .reduce((total, expense) => {
        // Only include expenses that are marked as monthly
        // or calculate monthly value from yearly expenses
        if (expense.isMonthly) {
          // Skip monthly items that are auto-calculated from yearly values
          // to avoid double counting
          if (expense.id === 'equipment-monthly' || expense.id === 'animals-monthly') {
            return total;
          }
          return total + (expense.value || 0);
        } else {
          // Convert yearly expenses to monthly
          return total + ((expense.value || 0) / 12);
        }
      }, 0);
    
    return monthlyTotal;
  };

  const calculateMonthlyIncome = () => {
    return incomes
      .filter(income => income.value !== null)
      .reduce((total, income) => {
        if (income.isMonthly) {
          // Skip monthly items that are auto-calculated from yearly values
          // to avoid double counting
          if (income.id === 'eggs-hatching-monthly' || income.id === 'animals-monthly') {
            return total;
          }
          return total + (income.value || 0);
        } else {
          // Convert yearly incomes to monthly
          return total + ((income.value || 0) / 12);
        }
      }, 0);
  };

  const monthlyProfit = calculateMonthlyIncome() - calculateMonthlyExpenses();
  const yearlyProfit = monthlyProfit * 12;

  // Format number to Czech currency format (spaces as thousand separators, comma as decimal separator)
  const formatCurrency = (value: number) => {
    return value.toLocaleString('cs-CZ', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' Kč';
  };

  // Delete custom expense
  const handleDeleteCustomExpense = (id: string) => {
    // Update local state immediately
    setExpenses(expenses.filter(expense => expense.id !== id));
    
    // Delete from database
    deleteExpenseItem({ itemId: id });
  };

  // Delete custom income
  const handleDeleteCustomIncome = (id: string) => {
    // Update local state immediately
    setIncomes(incomes.filter(income => income.id !== id));
    
    // Delete from database
    deleteIncomeItem({ itemId: id });
  };

  // Handle animal count change
  const handleAnimalCountChange = (value: number | null) => {
    // Ensure value is not negative and convert empty input to 0
    const sanitizedValue = value !== null ? Math.max(0, value) : 0;
    
    // Update local state immediately
    setLocalAnimalCount(sanitizedValue);
    
    // Trigger immediate recalculation for UI
    setTimeout(() => {
      calculateMonthlyPerAnimalCost();
      calculateYearlyPerAnimalCost();
    }, 0);
    
    // Debounce the database save
    debounceSave('animal-count', () => {
      saveAnimalCount({ count: sanitizedValue }); // Always save a number, never undefined
    }, 800);
  };

  // Calculate per-animal costs
  const calculateMonthlyPerAnimalCost = () => {
    if (!localAnimalCount || localAnimalCount <= 0) return 0;
    return calculateMonthlyExpenses() / localAnimalCount;
  };

  const calculateYearlyPerAnimalCost = () => {
    if (!localAnimalCount || localAnimalCount <= 0) return 0;
    return calculateMonthlyExpenses() * 12 / localAnimalCount;
  };

  return (
    <div className="grid gap-8">
      {/* Main content area with animal count and tables */}
      {/* Animal Count Input - Now in the first column */}
      <div className="h-fit md:w-1/2 md:pr-6">
        <h2 className="text-xl font-bold mb-4">Počet chovaných zvířat</h2>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Input 
            type="number" 
            placeholder="Zadejte počet zvířat"
            value={localAnimalCount === null || localAnimalCount === undefined ? '' : localAnimalCount === 0 ? '0' : localAnimalCount.toString()}
            onChange={(e) => {
              const value = e.target.value === '' ? null : parseFloat(e.target.value);
              handleAnimalCountChange(value);
            }}
            min="0"
          />
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Expenses Table - Now in the second column */}
        <div>
          <h2 className="text-xl font-bold mb-4">Náklady na chov</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Položka</TableHead>
                <TableHead>Hodnota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Show skeleton rows while loading
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`skeleton-expense-${index}`}>
                    <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {expense.isCustom ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={expense.name}
                            onChange={(e) => handleExpenseNameChange(expense.id, e.target.value)}
                            className="border-0 bg-transparent hover:bg-muted/50 focus:bg-muted/50"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCustomExpense(expense.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        expense.name
                      )}
                    </TableCell>
                    <TableCell>
                      {expense.id === 'equipment-monthly' || expense.id === 'animals-monthly' ? (
                        <Input
                          type="text"
                          value={expense.value === null || expense.value === 0 ? '0,00' : expense.value.toLocaleString('cs-CZ', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                          readOnly
                          disabled
                          className="bg-muted/50"
                        />
                      ) : (
                        <Input
                          type="number"
                          value={editingValues[expense.id] !== undefined ? editingValues[expense.id] : 
                                 expense.value === null || expense.value === undefined ? '' : 
                                 expense.value === 0 ? '0' : expense.value.toString()}
                          onChange={(e) => handleExpenseChange(
                            expense.id, 
                            e.target.value === '' ? null : parseFloat(e.target.value)
                          )}
                          placeholder="Zadat hodnotu"
                          step="0.01"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addCustomExpense} 
                  className="mt-2 w-full"
                  disabled={isLoading}
                >
                  + Přidat vlastní položku
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Počítá se jako hodnota za měsíc</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Income Table - Now in the third column */}
        <div>
          <h2 className="text-xl font-bold mb-4">Příjmy</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Položka</TableHead>
                <TableHead>Hodnota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Show skeleton rows while loading
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`skeleton-income-${index}`}>
                    <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : (
                incomes.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell>
                      {income.isCustom ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={income.name}
                            onChange={(e) => handleIncomeNameChange(income.id, e.target.value)}
                            className="border-0 bg-transparent hover:bg-muted/50 focus:bg-muted/50"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCustomIncome(income.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        income.name
                      )}
                    </TableCell>
                    <TableCell>
                      {income.id === 'eggs-hatching-monthly' || income.id === 'animals-monthly' ? (
                        <Input
                          type="text"
                          value={income.value === null || income.value === 0 ? '0,00' : income.value.toLocaleString('cs-CZ', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                          readOnly
                          disabled
                          className="bg-muted/50"
                        />
                      ) : (
                        <Input
                          type="number"
                          value={editingValues[income.id] !== undefined ? editingValues[income.id] : 
                                 income.value === null || income.value === undefined ? '' : 
                                 income.value === 0 ? '0' : income.value.toString()}
                          onChange={(e) => handleIncomeChange(
                            income.id, 
                            e.target.value === '' ? null : parseFloat(e.target.value)
                          )}
                          placeholder="Zadat hodnotu"
                          step="0.01"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addCustomIncome} 
                  className="mt-2 w-full"
                  disabled={isLoading}
                >
                  + Přidat vlastní položku
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Počítá se jako hodnota za měsíc</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Summary Section - Remains full width */}
      <div className="mt-8 p-6 border rounded-lg bg-muted/30">
        <h2 className="text-xl font-bold mb-4">Souhrn</h2>
        
        {/* First row - Monthly and yearly totals */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-100/50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Celkové měsíční náklady</h3>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mb-2" />
            ) : (
              <p className="font-medium">{formatCurrency(calculateMonthlyExpenses())}</p>
            )}
          </div>
          <div className="bg-amber-100/50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Celkové roční náklady</h3>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mb-2" />
            ) : (
              <p className="font-medium">{formatCurrency(calculateMonthlyExpenses() * 12)}</p>
            )}
          </div>
          
          <div className="bg-green-100/50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Celkové měsíční příjmy</h3>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mb-2" />
            ) : (
              <p className="font-medium">{formatCurrency(calculateMonthlyIncome())}</p>
            )}
          </div>
          <div className="bg-green-100/50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Celkové roční příjmy</h3>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mb-2" />
            ) : (
              <p className="font-medium">{formatCurrency(calculateMonthlyIncome() * 12)}</p>
            )}
          </div>
        </div>
        
        {/* Second row - Per animal costs - Updated to show calculated values */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-100/50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Měsíční náklad na 1 zvíře</h3>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mb-2" />
            ) : (
              <p className="font-medium">
                {localAnimalCount ? formatCurrency(calculateMonthlyPerAnimalCost()) : "—"}
              </p>
            )}
          </div>
          <div className="bg-purple-100/50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Roční náklad na 1 zvíře</h3>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mb-2" />
            ) : (
              <p className="font-medium">
                {localAnimalCount ? formatCurrency(calculateYearlyPerAnimalCost()) : "—"}
              </p>
            )}
          </div>
        </div>
        
        {/* Third row - Balance */}
        <div className="bg-blue-100/50 p-4 rounded-md mb-6">
          <h3 className="font-semibold mb-2">Celkový stav chovu</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-medium">Měsíční bilance</h4>
              {isLoading ? (
                <Skeleton className="h-6 w-32 mb-2" />
              ) : (
                <p className={`font-bold ${monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(monthlyProfit)}
                </p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium">Roční bilance</h4>
              {isLoading ? (
                <Skeleton className="h-6 w-32 mb-2" />
              ) : (
                <p className={`font-bold ${yearlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(yearlyProfit)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}